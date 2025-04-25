import { z } from "zod";

const envValidation = z.object({
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID: z.string(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS: z.string(),
  EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB: z.string(),
  EXPO_PUBLIC_KEYCLOAK_URL: z.string().url(),
});

export const ENV = envValidation.parse(process.env);
