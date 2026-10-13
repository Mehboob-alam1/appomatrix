-- Appo Matrix CMS schema for MySQL 8+ and MariaDB 10.6+.
--
-- Assumptions
-- The repository had no MySQL schema or Hostinger dump. This file is the
-- schema of record. It mirrors the previous SQLite CMS (services, projects,
-- posts, team, testimonials, careers, scholarships, inquiries, users, and
-- settings) and adds navigation, social links, blog categories, homepage
-- sections, page SEO, and a media library.
--
-- Safety
-- Apply with CREATE TABLE IF NOT EXISTS only. The application migrator may
-- ADD COLUMN when a column is missing. It never DROP, TRUNCATE, DELETE, or
-- overwrites existing rows. Create an empty database in Hostinger first;
-- this file does not create the database itself.

CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(64) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  parent_id VARCHAR(64) NULL,
  short_description VARCHAR(2000) NOT NULL,
  full_description LONGTEXT NOT NULL,
  icon VARCHAR(64) NOT NULL DEFAULT 'globe',
  image VARCHAR(1000) NOT NULL DEFAULT '',
  image_alt VARCHAR(500) NOT NULL DEFAULT '',
  process_text LONGTEXT NOT NULL,
  tech_stack VARCHAR(1000) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_services_slug (slug),
  KEY idx_services_parent (parent_id),
  KEY idx_services_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS projects (
  id VARCHAR(64) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  category VARCHAR(191) NOT NULL,
  excerpt VARCHAR(2000) NOT NULL DEFAULT '',
  cover_image VARCHAR(1000) NOT NULL DEFAULT '',
  cover_image_alt VARCHAR(500) NOT NULL DEFAULT '',
  gallery LONGTEXT NOT NULL,
  problem LONGTEXT NOT NULL,
  solution LONGTEXT NOT NULL,
  result LONGTEXT NOT NULL,
  metrics_text LONGTEXT NOT NULL,
  tech_stack VARCHAR(1000) NOT NULL DEFAULT '',
  external_link VARCHAR(1000) NOT NULL DEFAULT '',
  featured TINYINT(1) NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  created_at VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_slug (slug),
  KEY idx_projects_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS post_categories (
  id VARCHAR(64) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  name VARCHAR(191) NOT NULL,
  description VARCHAR(2000) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_post_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS posts (
  id VARCHAR(64) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  excerpt VARCHAR(2000) NOT NULL,
  content LONGTEXT NOT NULL,
  featured_image VARCHAR(1000) NOT NULL DEFAULT '',
  featured_image_alt VARCHAR(500) NOT NULL DEFAULT '',
  author VARCHAR(255) NOT NULL DEFAULT '',
  category VARCHAR(191) NOT NULL DEFAULT 'Notes',
  category_id VARCHAR(64) NULL,
  published_at VARCHAR(40) NOT NULL,
  reading_time_minutes INT NOT NULL DEFAULT 1,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_posts_slug (slug),
  KEY idx_posts_category (category_id),
  KEY idx_posts_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS team_members (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  photo VARCHAR(1000) NOT NULL DEFAULT '',
  photo_alt VARCHAR(500) NOT NULL DEFAULT '',
  bio LONGTEXT NOT NULL,
  linkedin VARCHAR(1000) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_team_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(64) NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  quote LONGTEXT NOT NULL,
  rating INT NOT NULL DEFAULT 5,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_testimonials_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS careers (
  id VARCHAR(64) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  kind VARCHAR(64) NOT NULL DEFAULT 'Role',
  location VARCHAR(255) NOT NULL DEFAULT '',
  department VARCHAR(255) NOT NULL DEFAULT '',
  summary VARCHAR(2000) NOT NULL,
  description LONGTEXT NOT NULL,
  requirements LONGTEXT NOT NULL,
  deadline VARCHAR(40) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_careers_slug (slug),
  KEY idx_careers_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS scholarships (
  id VARCHAR(64) NOT NULL,
  slug VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  award VARCHAR(500) NOT NULL DEFAULT '',
  eligibility VARCHAR(2000) NOT NULL DEFAULT '',
  deadline VARCHAR(40) NOT NULL DEFAULT '',
  summary VARCHAR(2000) NOT NULL,
  description LONGTEXT NOT NULL,
  cover_image VARCHAR(1000) NOT NULL DEFAULT '',
  cover_image_alt VARCHAR(500) NOT NULL DEFAULT '',
  application_url VARCHAR(1000) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_scholarships_slug (slug),
  KEY idx_scholarships_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(320) NOT NULL,
  phone VARCHAR(64) NOT NULL DEFAULT '',
  company VARCHAR(255) NOT NULL DEFAULT '',
  topic VARCHAR(255) NOT NULL DEFAULT '',
  budget VARCHAR(255) NOT NULL DEFAULT '',
  message LONGTEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'new',
  submitted_at VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_inquiries_status (status),
  KEY idx_inquiries_submitted (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) NOT NULL,
  username VARCHAR(191) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS settings (
  `key` VARCHAR(191) NOT NULL,
  value LONGTEXT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS nav_items (
  id VARCHAR(64) NOT NULL,
  location VARCHAR(32) NOT NULL,
  label VARCHAR(255) NOT NULL,
  href VARCHAR(500) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_nav_location (location, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_links (
  id VARCHAR(64) NOT NULL,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(1000) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  KEY idx_social_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS homepage_sections (
  id VARCHAR(64) NOT NULL,
  section_key VARCHAR(64) NOT NULL,
  kicker VARCHAR(255) NOT NULL DEFAULT '',
  title VARCHAR(500) NOT NULL DEFAULT '',
  body LONGTEXT NOT NULL,
  image VARCHAR(1000) NOT NULL DEFAULT '',
  image_alt VARCHAR(500) NOT NULL DEFAULT '',
  cta_label VARCHAR(255) NOT NULL DEFAULT '',
  cta_href VARCHAR(500) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_homepage_sections_key (section_key),
  KEY idx_homepage_sections_sort (sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_meta (
  id VARCHAR(64) NOT NULL,
  path VARCHAR(191) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description VARCHAR(500) NOT NULL,
  kicker VARCHAR(255) NOT NULL DEFAULT '',
  heading VARCHAR(500) NOT NULL DEFAULT '',
  lead VARCHAR(2000) NOT NULL DEFAULT '',
  body LONGTEXT NULL,
  secondary_title VARCHAR(255) NOT NULL DEFAULT '',
  image VARCHAR(1000) NOT NULL DEFAULT '',
  image_alt VARCHAR(500) NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  published TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_page_meta_path (path)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS media (
  id VARCHAR(64) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL DEFAULT '',
  mime VARCHAR(100) NOT NULL,
  size_bytes INT NOT NULL DEFAULT 0,
  alt VARCHAR(500) NOT NULL DEFAULT '',
  url VARCHAR(500) NOT NULL,
  created_at VARCHAR(40) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_media_filename (filename),
  KEY idx_media_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS schema_migrations (
  id VARCHAR(191) NOT NULL,
  applied_at VARCHAR(40) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
