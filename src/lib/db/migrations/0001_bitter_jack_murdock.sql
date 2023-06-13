ALTER TABLE "customers" ADD COLUMN "tin_number" text NOT NULL;
ALTER TABLE "sales" ADD COLUMN "doc_breed_type" text NOT NULL;
ALTER TABLE "sales" ADD COLUMN "feed_type" text NOT NULL;
ALTER TABLE "sales" ADD COLUMN "vaccine_doses" integer NOT NULL;
ALTER TABLE "sales" ADD COLUMN "vaccine_unit_price" integer NOT NULL;
ALTER TABLE "sales" ADD COLUMN "vaccine_type" text NOT NULL;