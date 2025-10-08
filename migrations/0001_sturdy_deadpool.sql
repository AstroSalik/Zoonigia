ALTER TABLE "workshops" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "workshops" ADD COLUMN "featured_order" integer DEFAULT 0;