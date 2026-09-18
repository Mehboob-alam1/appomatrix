<?php

declare(strict_types=1);

final class Migrator
{
    public static function run(PDO $db, string $drizzleDir): void
    {
        $db->exec(
            'CREATE TABLE IF NOT EXISTS _migrations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tag TEXT NOT NULL UNIQUE,
                applied_at TEXT NOT NULL
            )'
        );

        $files = glob($drizzleDir . '/*.sql') ?: [];
        sort($files);

        foreach ($files as $file) {
            $tag = basename($file, '.sql');
            $stmt = $db->prepare('SELECT 1 FROM _migrations WHERE tag = ?');
            $stmt->execute([$tag]);
            if ($stmt->fetchColumn()) {
                continue;
            }

            $sql = file_get_contents($file);
            if ($sql === false) {
                continue;
            }
            $sql = preg_replace('/--> statement-breakpoint\s*/', "\n", $sql) ?? $sql;
            try {
                $db->exec($sql);
            } catch (PDOException $e) {
                $msg = $e->getMessage();
                $alreadyApplied = str_contains($msg, 'already exists')
                    || str_contains($msg, 'duplicate column');
                if (!$alreadyApplied) {
                    throw $e;
                }
            }

            $ins = $db->prepare('INSERT INTO _migrations (tag, applied_at) VALUES (?, ?)');
            $ins->execute([$tag, date('c')]);
        }

        $row = $db->query("SELECT 1 FROM site_settings WHERE id = 'global'")->fetchColumn();
        if (!$row) {
            $db->exec(
                "INSERT INTO site_settings (id, head_html, body_start_html, body_end_html, announcement_html,
                blog_sidebar_html, blog_in_article_html, global_seo_extra, calendly_url,
                contact_email, contact_phone, contact_whatsapp, contact_address, updated_at)
                VALUES ('global', '', '', '', '', '', '', '', '', '', '', '', '', datetime('now'))"
            );
        }
    }
}
