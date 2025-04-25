import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { resApi } from "src/api";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import * as AuthSession from "expo-auth-session";
import { ENV } from "src/constants";
import logger from "src/utils/logger";
import { z } from "zod";

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
  logout: () => void;
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
    console.error("Invalid JWT format:", idToken, error);
    throw error;
  }
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
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

  const isAuthenticated = useMemo(() => {
    return !!accessToken;
  }, [accessToken]);

  const isError = useMemo(() => {
    return error !== null;
  }, [error]);

  const removeAccountInfo = useCallback(() => {
    setAccessToken(null);
    setRefreshToken(null);
    setAccount(null);
  }, []);

  const login = useCallback(async () => {
    if (!request) return;
    const response = await promptAsync();
    try {
      if (response?.type === "success") {
        const { code } = response.params;
        const responseTokens = await AuthSession.exchangeCodeAsync(
          {
            clientId: request?.clientId,
            code,
            redirectUri: request?.redirectUri,
            extraParams: {
              code_verifier: request?.codeVerifier!,
            },
          },
          discovery
        );
        if (!responseTokens?.refreshToken) throw new Error("Missing refresh token in response");
        if (!responseTokens?.idToken) throw new Error("Missing id token in response");
        setAccessToken(responseTokens.accessToken);
        setRefreshToken(responseTokens.refreshToken);
        setAccount(extractAccountClaims(responseTokens.idToken));
      } else {
        throw new Error("Bad response type");
      }
    } catch (error) {
      removeAccountInfo();
      if (error instanceof Error) {
        setError(error.message);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        logger.error(error);
        removeAccountInfo();
        setError("An unknown error occurred");
      }
    }
  }, [request, promptAsync, removeAccountInfo]);

  const logout = useCallback(() => {
    removeAccountInfo();
  }, [removeAccountInfo]);

  // const tryRefreshAccessToken = useCallback(async () => {
  //   try {
  //     const response = await authApi.post("/auth/refresh", {}, { withCredentials: true });
  //     console.log("Access token refresh successfully");
  //     setAccessToken(response.data.accessToken);
  //   } catch (error) {
  //     console.warn("Access token refresh failed: ", error);
  //     setAccessToken(null);
  //   }
  // }, [setAccessToken]);

  // useEffect(() => {
  //   tryRefreshAccessToken();
  // }, [tryRefreshAccessToken]);

  useLayoutEffect(() => {
    function accessTokenInterceptor(config: InternalAxiosRequestConfig) {
      config.headers.Authorization = accessToken ? `Bearer ${accessToken}` : config.headers.Authorization;
      return config;
    }

    // const authInterceptorId = authApi.interceptors.request.use(accessTokenInterceptor);
    const resInterceptorId = resApi.axios.interceptors.request.use(accessTokenInterceptor);

    return () => {
      // authApi.interceptors.request.eject(authInterceptorId);
      resApi.axios.interceptors.request.eject(resInterceptorId);
    };
  }, [accessToken]);

  useLayoutEffect(() => {
    function responseInterceptorFactory(api: AxiosInstance) {
      return async (error: AxiosError) => {
        const fullUrl = (error.config?.baseURL ?? "") + (error.config?.url ?? "");
        if (!error.config || fullUrl.includes("/auth/refresh")) {
          return Promise.reject(error);
        }
        const originalRequest = error.config;
        if (
          error.response?.status === axios.HttpStatusCode.Unauthorized &&
          !(originalRequest as any)._retry
        ) {
          (originalRequest as any)._retry = true;
          // await tryRefreshAccessToken();
          if (isAuthenticated) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
          }
        }
        return Promise.reject(error);
      };
    }

    // const authResponseInterceptorId = authApi.interceptors.response.use(
    //   (response) => response,
    //   responseInterceptorFactory(authApi)
    // );
    const resResponseInterceptorId = resApi.axios.interceptors.response.use(
      (response) => response,
      responseInterceptorFactory(resApi.axios)
    );

    return () => {
      // authApi.interceptors.response.eject(authResponseInterceptorId);
      resApi.axios.interceptors.response.eject(resResponseInterceptorId);
    };
  }, [accessToken, setAccessToken, isAuthenticated /*tryRefreshAccessToken*/]);

  return (
    <AuthContext.Provider
      value={{ accessToken, refreshToken, account, isAuthenticated, error, isError, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
