import { z } from "zod";

export const LogicalErrorSchema = z.object({
  code: z.enum(["PRICE_MISMATCH", "PHONE_NUMBER_MISSING", "KEYCLOAK_ERROR"]),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

export type LogicalError = z.infer<typeof LogicalErrorSchema>;
