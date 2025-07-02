import Constants from "expo-constants";
import { z } from "zod";

const constantsSchema = z.object({
  expoConfig: z.object({
    scheme: z.string(),
  }),
});

export const constantsParseResult = constantsSchema.safeParse(Constants);
export const CONSTANTS = (constantsParseResult.data ?? { expoConfig: {} }) as z.infer<typeof constantsSchema>;
