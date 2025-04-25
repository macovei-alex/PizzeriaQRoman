import { z } from "zod";

const envValidation = z.object({
  EXPO_PUBLIC_KEYCLOAK_REALM_URL: z.string().url(),
  EXPO_PUBLIC_KEYCLOAK_CLIENT_ID: z.string(),
});

export const ENV = envValidation.parse(process.env);
