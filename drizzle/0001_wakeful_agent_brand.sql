CREATE TABLE "dot_phrases" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"trigger_keyword" varchar(50) NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "dot_phrases_trigger_keyword_unique" UNIQUE("trigger_keyword")
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "procedure_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"procedure_id" uuid NOT NULL,
	"patient_id" uuid NOT NULL,
	"provider_id" uuid NOT NULL,
	"content" text NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "procedure_note_dot_phrases" (
	"note_id" uuid NOT NULL,
	"dot_phrase_id" uuid NOT NULL,
	CONSTRAINT "procedure_note_dot_phrases_note_id_dot_phrase_id_pk" PRIMARY KEY("note_id","dot_phrase_id")
);
--> statement-breakpoint
CREATE TABLE "note_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"note_id" uuid,
	"previous_content" text NOT NULL,
	"changed_by_user_id" uuid NOT NULL,
	"changed_at" timestamp DEFAULT now(),
	"action_type" varchar(20)
);
--> statement-breakpoint
ALTER TABLE "procedure_notes" ADD CONSTRAINT "procedure_notes_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedure_note_dot_phrases" ADD CONSTRAINT "procedure_note_dot_phrases_note_id_procedure_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."procedure_notes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "procedure_note_dot_phrases" ADD CONSTRAINT "procedure_note_dot_phrases_dot_phrase_id_dot_phrases_id_fk" FOREIGN KEY ("dot_phrase_id") REFERENCES "public"."dot_phrases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "note_history" ADD CONSTRAINT "note_history_note_id_procedure_notes_id_fk" FOREIGN KEY ("note_id") REFERENCES "public"."procedure_notes"("id") ON DELETE no action ON UPDATE no action;