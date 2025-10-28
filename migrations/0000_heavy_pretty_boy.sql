CREATE TABLE `cart_items` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`session_id` text,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`product_id` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` real NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`session_id` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`total_amount` real NOT NULL,
	`shipping_address` text,
	`billing_address` text,
	`payment_method` text,
	`payment_status` text DEFAULT 'pending' NOT NULL,
	`stripe_payment_intent_id` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`category_id` text,
	`image_url` text,
	`images` text,
	`stock_count` integer DEFAULT 0 NOT NULL,
	`is_digital` integer DEFAULT false NOT NULL,
	`download_url` text,
	`license_key` text,
	`is_featured` integer DEFAULT false NOT NULL,
	`is_limited_edition` integer DEFAULT false NOT NULL,
	`view_count` integer DEFAULT 0 NOT NULL,
	`average_rating` real DEFAULT 0 NOT NULL,
	`review_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`product_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sid` text PRIMARY KEY NOT NULL,
	`sess` text NOT NULL,
	`expire` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `IDX_session_expire` ON `sessions` (`expire`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text,
	`first_name` text,
	`last_name` text,
	`profile_image_url` text,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);