import fs from "fs";
import path from "path";
import { DatabaseSync } from "node:sqlite";
import { hashPassword } from "@/lib/auth";
import { defaultSettings, STARTER_PASSWORD, STARTER_USERNAME } from "@/lib/defaults";
import { seedContent } from "@/lib/seed";

const globalForDb = globalThis as unknown as { cms?: DatabaseSync };

function migrate(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      parent_id TEXT,
      short_description TEXT NOT NULL,
      full_description TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT 'globe',
      image TEXT NOT NULL DEFAULT '',
      image_alt TEXT NOT NULL DEFAULT '',
      process_text TEXT NOT NULL DEFAULT '',
      tech_stack TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      client_name TEXT NOT NULL,
      category TEXT NOT NULL,
      excerpt TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      cover_image_alt TEXT NOT NULL DEFAULT '',
      gallery TEXT NOT NULL DEFAULT '[]',
      problem TEXT NOT NULL DEFAULT '',
      solution TEXT NOT NULL DEFAULT '',
      result TEXT NOT NULL DEFAULT '',
      metrics_text TEXT NOT NULL DEFAULT '',
      tech_stack TEXT NOT NULL DEFAULT '',
      external_link TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      featured_image TEXT NOT NULL DEFAULT '',
      featured_image_alt TEXT NOT NULL DEFAULT '',
      author TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT 'Notes',
      published_at TEXT NOT NULL,
      reading_time_minutes INTEGER NOT NULL DEFAULT 1,
      published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      photo TEXT NOT NULL DEFAULT '',
      photo_alt TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      linkedin TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      client_name TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      quote TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS careers (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      kind TEXT NOT NULL DEFAULT 'Role',
      location TEXT NOT NULL DEFAULT '',
      department TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      requirements TEXT NOT NULL DEFAULT '',
      deadline TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS scholarships (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      award TEXT NOT NULL DEFAULT '',
      eligibility TEXT NOT NULL DEFAULT '',
      deadline TEXT NOT NULL DEFAULT '',
      summary TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      cover_image TEXT NOT NULL DEFAULT '',
      application_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0,
      published INTEGER NOT NULL DEFAULT 1
    );
    CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      company TEXT NOT NULL DEFAULT '',
      topic TEXT NOT NULL DEFAULT '',
      budget TEXT NOT NULL DEFAULT '',
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      submitted_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  const seeded = db.prepare("SELECT value FROM settings WHERE key = 'seeded'").get() as
    | { value: string }
    | undefined;
  if (seeded) return;

  db.exec("BEGIN");
  try {
    seedContent(db);
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run(
      "site",
      JSON.stringify(defaultSettings),
    );
    db.prepare("INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)").run(
      "user_admin",
      STARTER_USERNAME,
      hashPassword(STARTER_PASSWORD),
    );
    db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("seeded", "1");
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

export function getDb() {
  if (!globalForDb.cms) {
    const file = path.join(process.cwd(), "data", "cms.sqlite");
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const db = new DatabaseSync(file);
    db.exec("PRAGMA journal_mode = WAL");
    migrate(db);
    globalForDb.cms = db;
  }
  return globalForDb.cms;
}

export type Row = Record<string, unknown>;

export function all(sql: string, ...params: unknown[]) {
  return getDb().prepare(sql).all(...params) as Row[];
}

export function get(sql: string, ...params: unknown[]) {
  return getDb().prepare(sql).get(...params) as Row | undefined;
}

export function run(sql: string, ...params: unknown[]) {
  return getDb().prepare(sql).run(...params);
}
