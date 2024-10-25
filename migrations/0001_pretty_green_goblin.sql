CREATE TABLE IF NOT EXISTS "races" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"race_time" timestamp NOT NULL,
	"pix_key" text NOT NULL,
	"price_per_person" integer NOT NULL,
	"max_participants" integer NOT NULL,
	"race_date" timestamp NOT NULL,
	"notification_emails" json NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
