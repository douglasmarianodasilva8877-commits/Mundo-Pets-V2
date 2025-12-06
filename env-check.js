// env-check.js
console.log("=== ENV CHECK ===");

const requiredVars = [
  "UPLOADTHING_SECRET",
  "UPLOADTHING_APP_ID",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "DATABASE_URL",
  "NODE_ENV"
];

requiredVars.forEach((key) => {
  const value = process.env[key];
  console.log(`${key}:`, value ? "OK" : "MISSING", value || "");
});

console.log("==================");
