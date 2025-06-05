import { z } from "zod";

const publicEnvSchema = z
  .object({
    EXPO_PUBLIC_KEYCLOAK_REALM_URL: z.string().url(),
    EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
    EXPO_PUBLIC_API_BASE_URL: z.string().url(),
  })
  .transform((env) => ({
    KEYCLOAK_REALM_URL: env.EXPO_PUBLIC_KEYCLOAK_REALM_URL,
    KEYCLOAK_CLIENT_ID: env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
    API_BASE_URL: env.EXPO_PUBLIC_API_BASE_URL,
  }));

export const ENV = publicEnvSchema.parse({
  EXPO_PUBLIC_KEYCLOAK_REALM_URL: process.env.EXPO_PUBLIC_KEYCLOAK_REALM_URL,
  EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: process.env.EXPO_PUBLIC_KEYCLOAK_CLIENT_ID,
  EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});
