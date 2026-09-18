<?php

declare(strict_types=1);

final class Seed
{
    public static function runIfEmpty(PDO $db): void
    {
        $count = (int) $db->query('SELECT COUNT(*) FROM projects')->fetchColumn();
        if ($count > 0) {
            return;
        }

        $now = date('c');
        $data = require __DIR__ . '/seed-data.php';

        foreach ($data['projects'] as $p) {
            $stmt = $db->prepare(
                'INSERT INTO projects (id, slug, title, client_name, category, excerpt, cover_image, cover_image_alt,
                problem, solution, result, metrics, tech_stack, featured, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $p['id'], $p['slug'], $p['title'], $p['client_name'], $p['category'], $p['excerpt'],
                $p['cover_image'], $p['cover_image_alt'], $p['problem'], $p['solution'], $p['result'],
                json_encode($p['metrics']), json_encode($p['tech_stack']), $p['featured'] ? 1 : 0, $now,
            ]);
        }

        foreach ($data['posts'] as $post) {
            $stmt = $db->prepare(
                'INSERT INTO posts (id, slug, title, excerpt, content, featured_image, featured_image_alt,
                author, category, published_at, reading_time_minutes)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $post['id'], $post['slug'], $post['title'], $post['excerpt'], $post['content'],
                $post['featured_image'], $post['featured_image_alt'], $post['author'], $post['category'],
                $post['published_at'], $post['reading_time_minutes'],
            ]);
        }

        foreach ($data['testimonials'] as $t) {
            $stmt = $db->prepare(
                'INSERT INTO testimonials (id, client_name, role, company, quote, rating) VALUES (?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([$t['id'], $t['client_name'], $t['role'], $t['company'], $t['quote'], $t['rating']]);
        }

        foreach ($data['services'] as $s) {
            $stmt = $db->prepare(
                'INSERT INTO services (id, slug, title, short_description, full_description, icon, process_steps, tech_stack)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
            );
            $stmt->execute([
                $s['id'], $s['slug'], $s['title'], $s['short_description'], $s['full_description'],
                $s['icon'], json_encode($s['process_steps']), json_encode($s['tech_stack']),
            ]);
        }

        foreach ($data['team'] as $m) {
            $stmt = $db->prepare(
                'INSERT INTO team_members (id, name, role, bio, social) VALUES (?, ?, ?, ?, ?)'
            );
            $stmt->execute([$m['id'], $m['name'], $m['role'], $m['bio'], json_encode($m['social'] ?? [])]);
        }
    }
}
