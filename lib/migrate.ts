import { readFile } from "fs/promises";
import path from "path";
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { hashPassword } from "@/lib/password";
import { defaultSettings, STARTER_PASSWORD, STARTER_USERNAME } from "@/lib/defaults";
import { fillPageCopy } from "@/lib/page-copy";
import { seedContent } from "@/lib/seed";

const ADD_COLUMNS: { table: string; column: string; ddl: string }[] = [
  { table: "posts", column: "category_id", ddl: "ALTER TABLE posts ADD COLUMN category_id VARCHAR(64) NULL" },
  {
    table: "scholarships",
    column: "cover_image_alt",
    ddl: "ALTER TABLE scholarships ADD COLUMN cover_image_alt VARCHAR(500) NOT NULL DEFAULT ''",
  },
  { table: "page_meta", column: "kicker", ddl: "ALTER TABLE page_meta ADD COLUMN kicker VARCHAR(255) NOT NULL DEFAULT ''" },
  { table: "page_meta", column: "heading", ddl: "ALTER TABLE page_meta ADD COLUMN heading VARCHAR(500) NOT NULL DEFAULT ''" },
  { table: "page_meta", column: "lead", ddl: "ALTER TABLE page_meta ADD COLUMN lead LONGTEXT NOT NULL" },
  { table: "page_meta", column: "body", ddl: "ALTER TABLE page_meta ADD COLUMN body LONGTEXT NULL" },
  {
    table: "page_meta",
    column: "secondary_title",
    ddl: "ALTER TABLE page_meta ADD COLUMN secondary_title VARCHAR(255) NOT NULL DEFAULT ''",
  },
  { table: "page_meta", column: "image", ddl: "ALTER TABLE page_meta ADD COLUMN image VARCHAR(1000) NOT NULL DEFAULT ''" },
  {
    table: "page_meta",
    column: "image_alt",
    ddl: "ALTER TABLE page_meta ADD COLUMN image_alt VARCHAR(500) NOT NULL DEFAULT ''",
  },
];

/** Expand short VARCHAR content fields so TipTap HTML can save without truncation. */
const EXPAND_COLUMNS: { table: string; column: string; ddl: string }[] = [
  {
    table: "services",
    column: "short_description",
    ddl: "ALTER TABLE services MODIFY COLUMN short_description LONGTEXT NOT NULL",
  },
  { table: "projects", column: "excerpt", ddl: "ALTER TABLE projects MODIFY COLUMN excerpt LONGTEXT NOT NULL" },
  { table: "posts", column: "excerpt", ddl: "ALTER TABLE posts MODIFY COLUMN excerpt LONGTEXT NOT NULL" },
  {
    table: "post_categories",
    column: "description",
    ddl: "ALTER TABLE post_categories MODIFY COLUMN description LONGTEXT NOT NULL",
  },
  { table: "careers", column: "summary", ddl: "ALTER TABLE careers MODIFY COLUMN summary LONGTEXT NOT NULL" },
  {
    table: "scholarships",
    column: "eligibility",
    ddl: "ALTER TABLE scholarships MODIFY COLUMN eligibility LONGTEXT NOT NULL",
  },
  {
    table: "scholarships",
    column: "summary",
    ddl: "ALTER TABLE scholarships MODIFY COLUMN summary LONGTEXT NOT NULL",
  },
  { table: "page_meta", column: "lead", ddl: "ALTER TABLE page_meta MODIFY COLUMN lead LONGTEXT NOT NULL" },
];

function statements(sql: string) {
  return sql
    .replace(/\r\n/g, "\n")
    .replace(/^\s*--.*$/gm, "")
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean);
}

async function columnExists(pool: Pool, table: string, column: string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT COLUMN_NAME AS name FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return rows.length > 0;
}

async function columnDataType(pool: Pool, table: string, column: string) {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT DATA_TYPE AS t FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [table, column],
  );
  return String(rows[0]?.t || "");
}

export async function migrate(pool: Pool) {
  const file = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  for (const statement of statements(file)) {
    await pool.query(statement);
  }
  for (const column of ADD_COLUMNS) {
    if (!(await columnExists(pool, column.table, column.column))) {
      await pool.query(column.ddl);
    }
  }
  for (const column of EXPAND_COLUMNS) {
    const type = await columnDataType(pool, column.table, column.column);
    if (type && !["longtext", "mediumtext", "text"].includes(type)) {
      await pool.query(column.ddl);
    }
  }
  await pool.execute<ResultSetHeader>(
    "INSERT IGNORE INTO schema_migrations (id, applied_at) VALUES ('001_initial', ?)",
    [new Date().toISOString()],
  );

  const connection = await pool.getConnection();
  try {
    const [lockRows] = await connection.query<RowDataPacket[]>(
      "SELECT GET_LOCK('appomatrix_seed', 15) AS locked",
    );
    if (Number(lockRows[0]?.locked) !== 1) {
      throw new Error("Could not lock the database for setup. Retry in a moment.");
    }
    const [seeded] = await connection.execute<RowDataPacket[]>(
      "SELECT value FROM settings WHERE `key` = 'seeded'",
    );
    if (!seeded.length) {
      await connection.beginTransaction();
      try {
        const [serviceRows] = await connection.execute<RowDataPacket[]>("SELECT COUNT(*) AS c FROM services");
        const [userRows] = await connection.execute<RowDataPacket[]>("SELECT COUNT(*) AS c FROM users");
        const [site] = await connection.execute<RowDataPacket[]>(
          "SELECT value FROM settings WHERE `key` = 'site'",
        );
        if (!site.length) {
          await connection.execute("INSERT INTO settings (`key`, value) VALUES ('site', ?)", [
            JSON.stringify(defaultSettings),
          ]);
        }
        if (!Number(userRows[0]?.c || 0)) {
          await connection.execute("INSERT INTO users (id, username, password_hash) VALUES ('user_admin', ?, ?)", [
            STARTER_USERNAME,
            hashPassword(STARTER_PASSWORD),
          ]);
        }
        const exec = async (sql: string, params: unknown[] = []) => {
          await connection.execute(sql, params as never);
        };
        if (!Number(serviceRows[0]?.c || 0)) await seedContent(exec);
        else await seedContent(exec, { structureOnly: true });
        await connection.execute("INSERT INTO settings (`key`, value) VALUES ('seeded', '1')");
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }
  } finally {
    await connection.query("SELECT RELEASE_LOCK('appomatrix_seed')");
    connection.release();
  }

  await fillPageCopy(async (sql, params = []) => {
    await pool.execute(sql, params as never);
  });
}
