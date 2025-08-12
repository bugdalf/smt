PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text DEFAULT '' NOT NULL,
	`icon` text DEFAULT '' NOT NULL,
	`color` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "name", "icon", "color") SELECT "id", "name", "icon", "color" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;