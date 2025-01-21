CREATE TABLE `about_me` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workflow_id` text NOT NULL,
	`step_id` text NOT NULL,
	`content` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `about_me_user_id_workflow_id_step_id_unique` ON `about_me` (`user_id`,`workflow_id`,`step_id`);--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workflow_id` text NOT NULL,
	`step_id` text NOT NULL,
	`street` text NOT NULL,
	`city` text NOT NULL,
	`state` text NOT NULL,
	`zip` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `addresses_user_id_workflow_id_step_id_unique` ON `addresses` (`user_id`,`workflow_id`,`step_id`);--> statement-breakpoint
CREATE TABLE `birthdates` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workflow_id` text NOT NULL,
	`step_id` text NOT NULL,
	`birthdate` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `birthdates_user_id_workflow_id_step_id_unique` ON `birthdates` (`user_id`,`workflow_id`,`step_id`);--> statement-breakpoint
CREATE TABLE `user_workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`workflow_id` text NOT NULL,
	`completed_steps` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`edited_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_workflows_user_id_workflow_id_unique` ON `user_workflows` (`user_id`,`workflow_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `workflow_steps` (
	`id` text PRIMARY KEY NOT NULL,
	`workflow_id` text NOT NULL,
	`step` integer NOT NULL,
	`component` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `workflow_steps_workflow_id_step_unique` ON `workflow_steps` (`workflow_id`,`step`);--> statement-breakpoint
CREATE TABLE `workflows` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
