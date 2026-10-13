import mysql, { type Pool, type ResultSetHeader, type RowDataPacket } from "mysql2/promise";
import { migrate } from "@/lib/migrate";

export type Row = RowDataPacket & Record<string, unknown>;

type SqlValue = string | number | null;

const globalForDb = globalThis as unknown as {
  cmsPool?: Pool;
  cmsReady?: Promise<void>;
};

function required(name: string) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env and set your Hostinger MySQL credentials. The database must already exist; migrations do not create it and never drop tables.`,
    );
  }
  return value;
}

function password() {
  if (process.env.DB_PASSWORD === undefined) {
    throw new Error(
      "Missing DB_PASSWORD. Set it in .env even when the password is empty. Never commit the real value.",
    );
  }
  return process.env.DB_PASSWORD;
}

export function getPool() {
  if (!globalForDb.cmsPool) {
    const ssl = process.env.DB_SSL === "true";
    globalForDb.cmsPool = mysql.createPool({
      host: required("DB_HOST"),
      port: Number(process.env.DB_PORT || 3306),
      user: required("DB_USER"),
      password: password(),
      database: required("DB_NAME"),
      waitForConnections: true,
      connectionLimit: 10,
      maxIdle: 10,
      idleTimeout: 60_000,
      enableKeepAlive: true,
      timezone: "Z",
      dateStrings: true,
      multipleStatements: false,
      charset: "utf8mb4",
      ssl: ssl ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined,
    });
  }
  return globalForDb.cmsPool;
}

export function ensureReady() {
  if (!globalForDb.cmsReady) {
    globalForDb.cmsReady = migrate(getPool()).catch((error: unknown) => {
      globalForDb.cmsReady = undefined;
      throw error;
    });
  }
  return globalForDb.cmsReady;
}

export async function all(sql: string, params: SqlValue[] = []) {
  await ensureReady();
  const [rows] = await getPool().execute<Row[]>(sql, params);
  return rows;
}

export async function get(sql: string, params: SqlValue[] = []) {
  const rows = await all(sql, params);
  return rows[0];
}

export async function run(sql: string, params: SqlValue[] = []) {
  await ensureReady();
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}
