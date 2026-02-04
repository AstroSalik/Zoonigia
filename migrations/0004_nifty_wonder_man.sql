CREATE TABLE "coupon_code_usages" (
	"id" serial PRIMARY KEY NOT NULL,
	"coupon_code_id" integer NOT NULL,
	"user_id" varchar NOT NULL,
	"invoice_id" integer,
	"item_type" varchar NOT NULL,
	"item_id" integer NOT NULL,
	"original_amount" numeric(10, 2) NOT NULL,
	"discount_amount" numeric(10, 2) NOT NULL,
	"final_amount" numeric(10, 2) NOT NULL,
	"used_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "coupon_codes" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar NOT NULL,
	"description" text,
	"discount_type" varchar NOT NULL,
	"discount_value" numeric(10, 2) NOT NULL,
	"course_id" integer,
	"workshop_id" integer,
	"campaign_id" integer,
	"min_purchase_amount" numeric(10, 2),
	"max_discount_amount" numeric(10, 2),
	"usage_limit" integer,
	"used_count" integer DEFAULT 0 NOT NULL,
	"user_usage_limit" integer DEFAULT 1,
	"valid_from" timestamp DEFAULT now(),
	"valid_until" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "coupon_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "excerpt" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "scheduled_date" timestamp;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "featured_image" varchar;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "categories" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "tags" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "seo_title" varchar;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "seo_description" text;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "slug" varchar;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "view_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "like_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "comment_count" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD COLUMN "status" varchar DEFAULT 'draft';--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "coupon_code_id" integer;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "discount_amount" numeric(10, 2) DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "coupon_code_usages" ADD CONSTRAINT "coupon_code_usages_coupon_code_id_coupon_codes_id_fk" FOREIGN KEY ("coupon_code_id") REFERENCES "public"."coupon_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_code_usages" ADD CONSTRAINT "coupon_code_usages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_code_usages" ADD CONSTRAINT "coupon_code_usages_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_codes" ADD CONSTRAINT "coupon_codes_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_codes" ADD CONSTRAINT "coupon_codes_workshop_id_workshops_id_fk" FOREIGN KEY ("workshop_id") REFERENCES "public"."workshops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "coupon_codes" ADD CONSTRAINT "coupon_codes_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_coupon_code_id_coupon_codes_id_fk" FOREIGN KEY ("coupon_code_id") REFERENCES "public"."coupon_codes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug");