import * as AuthSession from "expo-auth-session";
import { useCallback, useEffect, useState } from "react";
import { ENV } from "src/constants/env";
import logger from "src/utils/logger";

const keycloakBaseRealmUrl = `${ENV.EXPO_PUBLIC_KEYCLOAK_URL}/realms/pizzeriaq`;

const discovery = {
  authorizationEndpoint: `${keycloakBaseRealmUrl}/protocol/openid-connect/auth`,
  tokenEndpoint: `${keycloakBaseRealmUrl}/protocol/openid-connect/token`,
};

export const useKeycloakRequest = () => {
  const [tokens, setTokens] = useState<{
    accessToken: string;
    idToken: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "pizzeriaq-android",
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
  const startAuth = useCallback(() => promptAsync(), [promptAsync]);

  useEffect(() => {
    (async () => {
      if (!request) return;
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
          if (!responseTokens?.idToken) {
            throw new Error("Missing id token in response");
          }
          setTokens({
            accessToken: responseTokens.accessToken,
            idToken: responseTokens.idToken,
          });
        } else {
          throw new Error("Bad response type");
        }
      } catch (error) {
        setTokens(null);
        if (error instanceof Error) {
          setError(error.message);
        } else if (typeof error === "string") {
          setError(error);
        } else {
          logger.error(error);
          setTokens(null);
          setError("An unknown error occurred");
        }
      }
    })();
  }, [request, response]);

  return {
    startAuth,
    tokens,
    error,
  };
};
