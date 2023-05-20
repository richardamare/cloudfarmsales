DO $$ BEGIN
 CREATE TYPE "payment_status" AS ENUM('pending', 'paid', 'partial', 'deposit');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "sales" ADD COLUMN "feed_amount" integer NOT NULL;
ALTER TABLE "sales" ADD COLUMN "feed_unit_price" integer NOT NULL;
ALTER TABLE "sales" ADD COLUMN "payment_status" "payment_status" NOT NULL;