import { z } from "zod";

const envValidation = z.object({
  EXPO_PUBLIC_KEYCLOAK_REALM_URL: z.string().url(),
  EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
});

const env = process.env as any;

export const ENV = envValidation.parse({
  EXPO_PUBLIC_KEYCLOAK_REALM_URL: env.EXPO_PUBLIC_KEYCLOAK_REALM_URL,
  EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
});
