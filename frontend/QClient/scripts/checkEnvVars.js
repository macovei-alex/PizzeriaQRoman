const expectedVars = [
  "EXPO_PUBLIC_KEYCLOAK_REALM_URL",
  "EXPO_PUBLIC_KEYCLOAK_CLIENT_ID",
  "EXPO_PUBLIC_API_BASE_URL",
  "GOOGLE_MAPS_API_KEY",
];

const missingVars = expectedVars.filter((envVar) => !process.env[envVar]);
if (missingVars.length > 0) {
  console.error("Missing environment variables:", missingVars.join(", "));
  process.exit(1);
}

console.log("Environment variables successfully checked");
