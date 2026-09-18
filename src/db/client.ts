import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import fs from "fs";
import path from "path";
import * as schema from "@/db/schema";
import { seedDatabaseIfEmpty } from "@/db/seed";
import { eq } from "drizzle-orm";

let dbInstance: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const sqlite = new Database(path.join(dataDir, "cms.sqlite"));
  sqlite.pragma("journal_mode = WAL");

  const db = drizzle(sqlite, { schema });
  migrate(db, { migrationsFolder: path.join(process.cwd(), "drizzle") });
  seedDatabaseIfEmpty(db);

  const settingsRow = db.select().from(schema.siteSettings).where(eq(schema.siteSettings.id, "global")).get();
  if (!settingsRow) {
    db.insert(schema.siteSettings)
      .values({
        id: "global",
        headHtml: "",
        bodyStartHtml: "",
        bodyEndHtml: "",
        announcementHtml: "",
        blogSidebarHtml: "",
        blogInArticleHtml: "",
        globalSeoExtra: "",
        calendlyUrl: "",
        updatedAt: new Date().toISOString(),
      })
      .run();
  }

  dbInstance = db;
  return db;
}
