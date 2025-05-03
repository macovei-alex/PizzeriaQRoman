import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { api } from "src/api";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import * as AuthSession from "expo-auth-session";
import { ENV } from "src/constants";
import logger from "src/utils/logger";
import { z } from "zod";
import * as SecureStore from "expo-secure-store";

const AccountClaimsSchema = z
  .object({
    sub: z.string(),
    email: z.string().email(),
    email_verified: z
      .boolean()
      .optional()
      .transform((val) => val ?? false),
    given_name: z.string(),
    family_name: z.string(),
  })
  .passthrough()
  .transform(({ sub, email, email_verified, given_name, family_name, ...rest }) => ({
    ...rest,
    id: sub,
    email,
    emailVerified: email_verified,
    givenName: given_name,
    familyName: family_name,
  }));

type AccountClaims = z.infer<typeof AccountClaimsSchema>;

type AuthContextType = {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
  account: AccountClaims | null;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const discovery = {
  authorizationEndpoint: `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/auth`,
  tokenEndpoint: `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/token`,
};

const AuthContext = createContext<AuthContextType | null>(null);

function extractAccountClaims(idToken: string): AccountClaims {
  try {
    return AccountClaimsSchema.parse(JSON.parse(atob(idToken.split(".")[1])));
  } catch (error) {
    logger.error("Invalid JWT format:", idToken);
    logger.error("Error decoding JWT:", error);
    throw error;
  }
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within a AuthContextProvider");
  return context;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  logger.render("AuthContextProvider");

  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | null | undefined>(undefined);
  const [account, setAccount] = useState<AccountClaims | null>(null);
  const [request, , promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: ENV.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "com.pizzeriaq",
        path: "redirect",
      }),
      scopes: ["openid", "profile", "email"],
      extraParams: {
        prompt: "login",
      },
    },
    discovery
  );
  const tokenRefreshSharedPromise = useRef<Promise<string | null> | null>(null);
  const isAuthenticated = useMemo(() => {
    if (!refreshToken) return false;
    const payload = JSON.parse(atob(refreshToken.split(".")[1]));
    if (!payload.exp) return false;
    const exp = payload.exp * 1000;
    return Date.now() < exp;
  }, [refreshToken]);

  const saveAccessToken = useCallback(async (val: typeof accessToken) => {
    setAccessToken(val);
    return val ? SecureStore.setItemAsync("accessToken", val) : SecureStore.deleteItemAsync("accessToken");
  }, []);

  const saveRefreshToken = useCallback(async (val: typeof refreshToken) => {
    setRefreshToken(val);
    return val ? SecureStore.setItemAsync("refreshToken", val) : SecureStore.deleteItemAsync("refreshToken");
  }, []);

  const saveAccount = useCallback(async (val: typeof account) => {
    setAccount(val);
    return val
      ? SecureStore.setItemAsync("account", JSON.stringify(val))
      : SecureStore.deleteItemAsync("account");
  }, []);

  const saveAccountInfo = useCallback(
    async (access: typeof accessToken, refresh: typeof refreshToken, acc: typeof account) => {
      return Promise.all([saveAccessToken(access), saveRefreshToken(refresh), saveAccount(acc)]);
    },
    [saveAccessToken, saveRefreshToken, saveAccount]
  );

  const removeAccountInfo = useCallback(async () => {
    return Promise.all([saveAccessToken(null), saveRefreshToken(null), saveAccount(null)]);
  }, [saveAccessToken, saveRefreshToken, saveAccount]);

  const login = useCallback(async () => {
    if (!request) return;
    const response = await promptAsync();
    try {
      if (response?.type === "success") {
        const responseTokens = await AuthSession.exchangeCodeAsync(
          {
            clientId: request?.clientId,
            code: response.params.code,
            redirectUri: request?.redirectUri,
            extraParams: {
              code_verifier: request?.codeVerifier!,
            },
          },
          discovery
        );
        if (!responseTokens?.refreshToken) throw new Error("Missing refresh token in response");
        if (!responseTokens?.idToken) throw new Error("Missing id token in response");
        await saveAccountInfo(
          responseTokens.accessToken,
          responseTokens.refreshToken,
          extractAccountClaims(responseTokens.idToken)
        );
      } else {
        throw new Error("Bad response type");
      }
    } catch (error) {
      logger.error("Login failed: ", error);
    }
  }, [request, promptAsync, saveAccountInfo]);

  const logout = useCallback(async () => {
    await Promise.all([
      axios.post(
        `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/logout`,
        {
          client_id: ENV.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
          refresh_token: refreshToken,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      ),
      removeAccountInfo(),
    ]);
  }, [removeAccountInfo, refreshToken]);

  const tryRefreshTokens = useCallback(async () => {
    if (!refreshToken) return null;
    try {
      const response = await axios.post(
        `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/token`,
        {
          grant_type: "refresh_token",
          client_id: ENV.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
          refresh_token: refreshToken,
        },
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      if (!response.data.access_token) throw new Error("Missing access token in response");
      if (!response.data.refresh_token) throw new Error("Missing refresh token in response");
      if (!response.data.id_token) throw new Error("Missing id token in response");
      await saveAccountInfo(
        response.data.access_token,
        response.data.refresh_token,
        extractAccountClaims(response.data.id_token)
      );
      return response.data.access_token as string;
    } catch (error) {
      logger.warn("Access token refresh failed:", error);
      removeAccountInfo();
      return null;
    }
  }, [refreshToken, saveAccountInfo, removeAccountInfo]);

  useLayoutEffect(() => {
    const interceptorId = api.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (!(config as typeof config & { _retry?: boolean })._retry) {
        config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : config.headers.Authorization;
      }
      return config;
    });
    return () => api.axios.interceptors.request.eject(interceptorId);
  }, [accessToken]);

  useLayoutEffect(() => {
    const interceptorId = api.axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const fullUrl = (error.config?.baseURL ?? "") + (error.config?.url ?? "");
        const tokenUrl = `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/token`;
        if (!error.config || fullUrl === tokenUrl) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as typeof error.config & { _retry?: boolean };
        if (error.response?.status !== axios.HttpStatusCode.Unauthorized || originalRequest._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        if (!tokenRefreshSharedPromise.current) {
          tokenRefreshSharedPromise.current = tryRefreshTokens();
        }
        const newAccessToken = await tokenRefreshSharedPromise.current;
        tokenRefreshSharedPromise.current = null;

        if (newAccessToken) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api.axios(originalRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => api.axios.interceptors.response.eject(interceptorId);
  }, [tryRefreshTokens]);

  useLayoutEffect(() => {
    const accessToken = SecureStore.getItem("accessToken");
    const refreshToken = SecureStore.getItem("refreshToken");
    const account = SecureStore.getItem("account");
    if (!accessToken || !refreshToken || !account) {
      if (!!accessToken || !!refreshToken || !!account) {
        logger.error("Some account information is missing");
        removeAccountInfo();
      }
      return;
    }
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    setAccount(JSON.parse(account));
  }, [removeAccountInfo]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        account,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
