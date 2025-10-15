-- Add missing columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS zip_code text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS subtotal numeric;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_charges numeric DEFAULT 0;

-- Rename postal_code to zip_code if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'postal_code') THEN
    ALTER TABLE orders RENAME COLUMN postal_code TO zip_code_old;
  END IF;
END $$;

-- Update total_amount column to allow it to be calculated
ALTER TABLE orders ALTER COLUMN total_amount DROP NOT NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS total numeric;

-- Add payment_proof_url column
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof_url text;

-- Add payment_method as text (instead of just payment_method_id)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method text;

-- Create payment-proofs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for payment-proofs bucket
CREATE POLICY "Anyone can upload payment proofs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'payment-proofs');

CREATE POLICY "Anyone can view payment proofs"
ON storage.objects FOR SELECT
USING (bucket_id = 'payment-proofs');

-- Add order_items product_id and currency columns
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id integer;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS price_at_purchase numeric;
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS currency text DEFAULT 'PKR';