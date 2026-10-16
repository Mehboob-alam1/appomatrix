function envPresent(name: string) {
  return process.env[name] !== undefined && process.env[name] !== "";
}

export function databaseHint(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const code =
    typeof error === "object" && error && "code" in error ? String((error as { code?: string }).code || "") : "";

  if (message.includes("Missing DB_") || message.includes("Missing DB_PASSWORD")) {
    return "A required database environment variable is missing in Hostinger → Environment variables.";
  }
  if (code === "ER_ACCESS_DENIED_ERROR" || message.includes("Access denied")) {
    return "MySQL rejected the username or password. Check DB_USER and DB_PASSWORD in Hostinger.";
  }
  if (code === "ER_BAD_DB_ERROR" || message.includes("Unknown database")) {
    return "DB_NAME does not match a database on this account. Use u276950232_appomatrix.";
  }
  if (code === "ECONNREFUSED" || code === "ENOTFOUND" || code === "ETIMEDOUT" || message.includes("ECONNREFUSED")) {
    return "The app cannot reach MySQL. On Hostinger, set DB_HOST to the hostname shown in Databases → MySQL Databases (often localhost).";
  }
  if (!envPresent("DB_HOST") || !envPresent("DB_USER") || !envPresent("DB_NAME") || process.env.DB_PASSWORD === undefined) {
    return "Database environment variables are incomplete.";
  }
  return "MySQL is unreachable. Open Hostinger runtime logs for the exact error.";
}

export function databaseConfigSummary() {
  return {
    host: process.env.DB_HOST || null,
    port: process.env.DB_PORT || "3306",
    user: process.env.DB_USER || null,
    name: process.env.DB_NAME || null,
    passwordSet: process.env.DB_PASSWORD !== undefined && process.env.DB_PASSWORD !== "PASTE_THE_MYSQL_PASSWORD_HERE",
    ssl: process.env.DB_SSL === "true",
  };
}
