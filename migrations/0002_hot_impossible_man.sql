CREATE TABLE "invoices" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_number" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"item_type" varchar NOT NULL,
	"item_id" integer NOT NULL,
	"item_name" varchar NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"tax" numeric(10, 2) DEFAULT '0.00',
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_id" varchar,
	"payment_method" varchar,
	"payment_status" varchar DEFAULT 'completed',
	"invoice_url" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "invoices_invoice_number_unique" UNIQUE("invoice_number")
);
--> statement-breakpoint
CREATE TABLE "refund_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar NOT NULL,
	"invoice_id" integer NOT NULL,
	"item_type" varchar NOT NULL,
	"item_id" integer NOT NULL,
	"item_name" varchar NOT NULL,
	"refund_amount" numeric(10, 2) NOT NULL,
	"reason" text NOT NULL,
	"status" varchar DEFAULT 'pending',
	"admin_notes" text,
	"processed_by" varchar,
	"processed_at" timestamp,
	"refund_transaction_id" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "is_free" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "is_free" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_invoice_id_invoices_id_fk" FOREIGN KEY ("invoice_id") REFERENCES "public"."invoices"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refund_requests" ADD CONSTRAINT "refund_requests_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;