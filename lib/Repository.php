<?php

declare(strict_types=1);

final class Repository
{
    public function __construct(private PDO $db) {}

    public function getContact(): array
    {
        $s = $this->getSettings();
        return [
            'email' => $s['contact_email'] ?: 'hello@appomatrix.com',
            'phone' => $s['contact_phone'] ?: '+92 300 0000000',
            'whatsapp' => preg_replace('/\D/', '', $s['contact_whatsapp'] ?: '923000000000'),
            'address' => $s['contact_address'] ?: 'Gilgit, Gilgit-Baltistan, Pakistan',
        ];
    }

    public function getSettings(): array
    {
        $stmt = $this->db->query("SELECT * FROM site_settings WHERE id = 'global'");
        $row = $stmt->fetch();
        if (!$row) {
            return [];
        }
        return $row;
    }

    public function saveSettings(array $data): void
    {
        $stmt = $this->db->prepare(
            'UPDATE site_settings SET head_html = ?, body_start_html = ?, body_end_html = ?, announcement_html = ?,
            blog_sidebar_html = ?, blog_in_article_html = ?, global_seo_extra = ?, calendly_url = ?,
            contact_email = ?, contact_phone = ?, contact_whatsapp = ?, contact_address = ?,
            logo_url = ?, site_name = ?, updated_at = ?
            WHERE id = \'global\''
        );
        $stmt->execute([
            $data['head_html'] ?? '', $data['body_start_html'] ?? '', $data['body_end_html'] ?? '',
            $data['announcement_html'] ?? '', $data['blog_sidebar_html'] ?? '', $data['blog_in_article_html'] ?? '',
            $data['global_seo_extra'] ?? '', $data['calendly_url'] ?? '',
            $data['contact_email'] ?? '', $data['contact_phone'] ?? '', $data['contact_whatsapp'] ?? '',
            $data['contact_address'] ?? '', $data['logo_url'] ?? '', $data['site_name'] ?? '', date('c'),
        ]);
    }

    public function getBrandName(): string
    {
        $s = $this->getSettings();
        $name = trim($s['site_name'] ?? '');
        return $name !== '' ? $name : (string) config('site_name', 'Appo Matrix');
    }

    public function getLogoUrl(): string
    {
        return trim($this->getSettings()['logo_url'] ?? '');
    }

    /** @return list<array<string, mixed>> */
    public function services(): array
    {
        return $this->db->query('SELECT * FROM services ORDER BY title')->fetchAll();
    }

    public function serviceBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM services WHERE slug = ?');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    /** @return list<array<string, mixed>> */
    public function projects(bool $featuredOnly = false): array
    {
        if ($featuredOnly) {
            return $this->db->query('SELECT * FROM projects WHERE featured = 1 ORDER BY created_at DESC')->fetchAll();
        }
        return $this->db->query('SELECT * FROM projects ORDER BY created_at DESC')->fetchAll();
    }

    public function projectBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM projects WHERE slug = ?');
        $stmt->execute([$slug]);
        return $stmt->fetch() ?: null;
    }

    /** @return list<array<string, mixed>> */
    public function posts(): array
    {
        return $this->db->query('SELECT * FROM posts ORDER BY published_at DESC')->fetchAll();
    }

    public function postBySlug(string $slug): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM posts WHERE slug = ?');
        $stmt->execute([$slug]);
        return $stmt->fetch() ?: null;
    }

    /** @return list<array<string, mixed>> */
    public function testimonials(): array
    {
        return $this->db->query('SELECT * FROM testimonials ORDER BY rowid')->fetchAll();
    }

    /** @return list<array<string, mixed>> */
    public function team(): array
    {
        return $this->db->query('SELECT * FROM team_members ORDER BY name')->fetchAll();
    }

    /** @return list<array<string, mixed>> */
    public function submissions(): array
    {
        return $this->db->query('SELECT * FROM form_submissions ORDER BY submitted_at DESC')->fetchAll();
    }

    public function saveSubmission(array $data): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO form_submissions (id, name, email, phone, project_type, budget, timeline, details, source, submitted_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            uuid(), $data['name'], $data['email'], $data['phone'] ?? null,
            $data['project_type'], $data['budget'], $data['timeline'], $data['details'],
            $data['source'] ?? 'website', date('c'),
        ]);
    }

    /** @return list<array<string, mixed>> */
    public function all(string $table): array
    {
        $allowed = ['posts', 'projects', 'services', 'testimonials', 'team_members'];
        if (!in_array($table, $allowed, true)) {
            return [];
        }
        $order = $table === 'posts' ? 'published_at DESC' : ($table === 'projects' ? 'created_at DESC' : 'title');
        return $this->db->query("SELECT * FROM {$table} ORDER BY {$order}")->fetchAll();
    }

    public function find(string $table, string $id): ?array
    {
        $allowed = ['posts', 'projects', 'services', 'testimonials', 'team_members'];
        if (!in_array($table, $allowed, true)) {
            return null;
        }
        $stmt = $this->db->prepare("SELECT * FROM {$table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function delete(string $table, string $id): void
    {
        $allowed = ['posts', 'projects', 'services', 'testimonials', 'team_members'];
        if (!in_array($table, $allowed, true)) {
            return;
        }
        $stmt = $this->db->prepare("DELETE FROM {$table} WHERE id = ?");
        $stmt->execute([$id]);
    }

    public function savePost(array $d): void
    {
        $exists = $this->find('posts', $d['id']);
        if ($exists) {
            $stmt = $this->db->prepare(
                'UPDATE posts SET slug=?, title=?, excerpt=?, content=?, category=?, author=?, featured_image=?,
                seo_title=?, seo_description=?, published_at=?, reading_time_minutes=? WHERE id=?'
            );
            $stmt->execute([
                $d['slug'], $d['title'], $d['excerpt'], $d['content'], $d['category'], $d['author'] ?? '',
                $d['featured_image'] ?? '', $d['seo_title'] ?? '', $d['seo_description'] ?? '',
                $d['published_at'], (int) ($d['reading_time_minutes'] ?? 5), $d['id'],
            ]);
            return;
        }
        $stmt = $this->db->prepare(
            'INSERT INTO posts (id, slug, title, excerpt, content, category, author, featured_image, seo_title, seo_description, published_at, reading_time_minutes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $d['id'], $d['slug'], $d['title'], $d['excerpt'], $d['content'], $d['category'],
            $d['author'] ?? '', $d['featured_image'] ?? '', $d['seo_title'] ?? '', $d['seo_description'] ?? '',
            $d['published_at'], (int) ($d['reading_time_minutes'] ?? 5),
        ]);
    }

    public function saveProject(array $d): void
    {
        $exists = $this->find('projects', $d['id']);
        $fields = [
            $d['slug'], $d['title'], $d['client_name'], $d['category'], $d['excerpt'] ?? '',
            $d['cover_image'] ?? '', $d['problem'] ?? '', $d['solution'] ?? '', $d['result'] ?? '',
            $d['featured'] ? 1 : 0, $d['seo_title'] ?? '', $d['seo_description'] ?? '',
        ];
        if ($exists) {
            $stmt = $this->db->prepare(
                'UPDATE projects SET slug=?, title=?, client_name=?, category=?, excerpt=?, cover_image=?,
                problem=?, solution=?, result=?, featured=?, seo_title=?, seo_description=? WHERE id=?'
            );
            $stmt->execute([...$fields, $d['id']]);
            return;
        }
        $stmt = $this->db->prepare(
            'INSERT INTO projects (id, slug, title, client_name, category, excerpt, cover_image, problem, solution, result, featured, seo_title, seo_description, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$d['id'], ...$fields, date('c')]);
    }

    public function saveService(array $d): void
    {
        $exists = $this->find('services', $d['id']);
        if ($exists) {
            $stmt = $this->db->prepare(
                'UPDATE services SET slug=?, title=?, short_description=?, full_description=?, icon=?, seo_title=?, seo_description=? WHERE id=?'
            );
            $stmt->execute([
                $d['slug'], $d['title'], $d['short_description'], $d['full_description'] ?? '',
                $d['icon'] ?? '', $d['seo_title'] ?? '', $d['seo_description'] ?? '', $d['id'],
            ]);
            return;
        }
        $stmt = $this->db->prepare(
            'INSERT INTO services (id, slug, title, short_description, full_description, icon, seo_title, seo_description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([
            $d['id'], $d['slug'], $d['title'], $d['short_description'], $d['full_description'] ?? '',
            $d['icon'] ?? '', $d['seo_title'] ?? '', $d['seo_description'] ?? '',
        ]);
    }

    public function saveTestimonial(array $d): void
    {
        $exists = $this->find('testimonials', $d['id']);
        if ($exists) {
            $stmt = $this->db->prepare(
                'UPDATE testimonials SET client_name=?, role=?, company=?, quote=?, rating=? WHERE id=?'
            );
            $stmt->execute([$d['client_name'], $d['role'], $d['company'], $d['quote'], (int) $d['rating'], $d['id']]);
            return;
        }
        $stmt = $this->db->prepare(
            'INSERT INTO testimonials (id, client_name, role, company, quote, rating) VALUES (?, ?, ?, ?, ?, ?)'
        );
        $stmt->execute([$d['id'], $d['client_name'], $d['role'], $d['company'], $d['quote'], (int) $d['rating']]);
    }

    public function saveTeamMember(array $d): void
    {
        $exists = $this->find('team_members', $d['id']);
        if ($exists) {
            $stmt = $this->db->prepare('UPDATE team_members SET name=?, role=?, bio=? WHERE id=?');
            $stmt->execute([$d['name'], $d['role'], $d['bio'] ?? '', $d['id']]);
            return;
        }
        $stmt = $this->db->prepare('INSERT INTO team_members (id, name, role, bio) VALUES (?, ?, ?, ?)');
        $stmt->execute([$d['id'], $d['name'], $d['role'], $d['bio'] ?? '']);
    }
}
