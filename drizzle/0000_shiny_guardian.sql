CREATE TABLE `form_submissions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`project_type` text NOT NULL,
	`budget` text NOT NULL,
	`timeline` text NOT NULL,
	`details` text NOT NULL,
	`source` text,
	`submitted_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`locale` text DEFAULT 'en',
	`excerpt` text NOT NULL,
	`content` text,
	`featured_image` text,
	`featured_image_alt` text,
	`author` text,
	`category` text NOT NULL,
	`published_at` text NOT NULL,
	`reading_time_minutes` integer,
	`seo_title` text,
	`seo_description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `posts_slug_unique` ON `posts` (`slug`);--> statement-breakpoint
CREATE TABLE `projects` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`client_name` text NOT NULL,
	`category` text NOT NULL,
	`excerpt` text,
	`cover_image` text,
	`cover_image_alt` text,
	`gallery` text,
	`problem` text,
	`solution` text,
	`result` text,
	`metrics` text,
	`tech_stack` text,
	`external_link` text,
	`featured` integer DEFAULT false,
	`seo_title` text,
	`seo_description` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `projects_slug_unique` ON `projects` (`slug`);--> statement-breakpoint
CREATE TABLE `services` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`short_description` text NOT NULL,
	`full_description` text,
	`icon` text,
	`image` text,
	`image_alt` text,
	`process_steps` text,
	`tech_stack` text,
	`related_project_ids` text,
	`seo_title` text,
	`seo_description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`photo` text,
	`photo_alt` text,
	`bio` text,
	`social` text
);
--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` text PRIMARY KEY NOT NULL,
	`client_name` text NOT NULL,
	`role` text NOT NULL,
	`company` text NOT NULL,
	`quote` text NOT NULL,
	`photo` text,
	`photo_alt` text,
	`rating` integer
);
