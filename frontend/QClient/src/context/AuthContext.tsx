import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
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
    email: z.string().email(),
    email_verified: z
      .boolean()
      .optional()
      .transform((val) => val ?? false),
    given_name: z.string(),
    family_name: z.string(),
  })
  .passthrough()
  .transform(({ email, email_verified, given_name, family_name, ...rest }) => ({
    ...rest,
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
  error: string | null;
  isError: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  tryRefreshTokens: () => Promise<void>;
};

const discovery = {
  authorizationEndpoint: `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/auth`,
  tokenEndpoint: `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/token`,
};

export const AuthContext = createContext<AuthContextType | null>(null);

function extractAccountClaims(idToken: string): AccountClaims {
  try {
    const payload = idToken.split(".").slice(0, 2)[1];
    return AccountClaimsSchema.parse(JSON.parse(atob(payload)));
  } catch (error) {
    logger.error("Invalid JWT format:", idToken, error);
    throw error;
  }
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuthContext must be used within a AuthContextProvider");
  return context;
}

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null | undefined>(undefined);
  const [refreshToken, setRefreshToken] = useState<string | null | undefined>(undefined);
  const [account, setAccount] = useState<AccountClaims | null>(null);
  const [error, setError] = useState<string | null>(null);
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
  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);
  const isError = useMemo(() => error !== null, [error]);

  const setAccessTokenWrapper = useCallback(async (val: typeof accessToken) => {
    setAccessToken(val);
    if (val) {
      SecureStore.setItemAsync("accessToken", val);
    } else {
      await SecureStore.deleteItemAsync("accessToken");
    }
  }, []);

  const setRefreshTokenWrapper = useCallback(async (val: typeof refreshToken) => {
    setRefreshToken(val);
    if (val) {
      SecureStore.setItem("refreshToken", val);
    } else {
      await SecureStore.deleteItemAsync("refreshToken");
    }
  }, []);

  const setAccountWrapper = useCallback(async (val: typeof account) => {
    setAccount(val);
    if (val) {
      SecureStore.setItem("account", JSON.stringify(val));
    } else {
      await SecureStore.deleteItemAsync("account");
    }
  }, []);

  const setAccountInfo = useCallback(
    async ({
      access,
      refresh,
      acc,
    }: {
      access: typeof accessToken;
      refresh: typeof refreshToken;
      acc: typeof account;
    }) => {
      await Promise.all([
        setAccessTokenWrapper(access),
        setRefreshTokenWrapper(refresh),
        setAccountWrapper(acc),
      ]);
    },
    [setAccessTokenWrapper, setRefreshTokenWrapper, setAccountWrapper]
  );

  const removeAccountInfo = useCallback(async () => {
    await Promise.all([setAccessTokenWrapper(null), setRefreshTokenWrapper(null), setAccountWrapper(null)]);
  }, [setAccessTokenWrapper, setRefreshTokenWrapper, setAccountWrapper]);

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
        await setAccountInfo({
          access: responseTokens.accessToken,
          refresh: responseTokens.refreshToken,
          acc: extractAccountClaims(responseTokens.idToken),
        });
      } else {
        throw new Error("Bad response type");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        logger.error(error);
        setError("An unknown error occurred");
      }
    }
  }, [request, promptAsync, setAccountInfo]);

  const logout = useCallback(() => {
    removeAccountInfo();
    return Promise.resolve();
  }, [removeAccountInfo]);

  const tryRefreshTokens = useCallback(async () => {
    if (!refreshToken) return;
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
      await setAccountInfo({
        access: response.data.access_token,
        refresh: response.data.refresh_token,
        acc: extractAccountClaims(response.data.id_token),
      });
    } catch (error) {
      logger.warn("Access token refresh failed: ", error);
    }
  }, [refreshToken, setAccountInfo]);

  useLayoutEffect(() => {
    const resInterceptorId = api.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : config.headers.Authorization;
      return config;
    });
    return () => {
      api.axios.interceptors.request.eject(resInterceptorId);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    const responseInterceptorId = api.axios.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const fullUrl = (error.config?.baseURL ?? "") + (error.config?.url ?? "");
        if (
          !error.config ||
          fullUrl === `${ENV.EXPO_PUBLIC_KEYCLOAK_REALM_URL}/protocol/openid-connect/token`
        ) {
          return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (
          error.response?.status === axios.HttpStatusCode.Unauthorized &&
          !(originalRequest as any)._retry
        ) {
          (originalRequest as any)._retry = true;
          await tryRefreshTokens();
          if (isAuthenticated) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api.axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.axios.interceptors.response.eject(responseInterceptorId);
    };
  }, [accessToken, setAccessToken, isAuthenticated, tryRefreshTokens]);

  useLayoutEffect(() => {
    const accessToken = SecureStore.getItem("accessToken");
    const refreshToken = SecureStore.getItem("refreshToken");
    const account = SecureStore.getItem("account");
    if (!accessToken || !refreshToken || !account) {
      logger.error("Some account information is missing");
      removeAccountInfo();
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
        error,
        isError,
        login,
        logout,
        tryRefreshTokens,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
