CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`head_html` text,
	`body_start_html` text,
	`body_end_html` text,
	`announcement_html` text,
	`blog_sidebar_html` text,
	`blog_in_article_html` text,
	`global_seo_extra` text,
	`updated_at` text
);
