-- Create payment_methods table
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cash_on_delivery', 'advance_payment')),
  method_key TEXT NOT NULL UNIQUE,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  qr_code_url TEXT,
  account_number TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Anyone can view payment methods (for checkout), only authenticated users can manage
CREATE POLICY "Anyone can view payment methods"
ON public.payment_methods
FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert payment methods"
ON public.payment_methods
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update payment methods"
ON public.payment_methods
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete payment methods"
ON public.payment_methods
FOR DELETE
TO authenticated
USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-qr', 'payment-qr', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for QR codes
CREATE POLICY "Anyone can view QR codes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'payment-qr');

CREATE POLICY "Authenticated users can upload QR codes"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'payment-qr');

CREATE POLICY "Authenticated users can update QR codes"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'payment-qr')
WITH CHECK (bucket_id = 'payment-qr');

CREATE POLICY "Authenticated users can delete QR codes"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'payment-qr');

-- Insert default payment methods
INSERT INTO public.payment_methods (name, type, method_key, is_enabled, display_order)
VALUES 
  ('Cash on Delivery', 'cash_on_delivery', 'cod', true, 0),
  ('Bank Transfer', 'advance_payment', 'bank_transfer', true, 1),
  ('Easypaisa', 'advance_payment', 'easypaisa', true, 2),
  ('JazzCash', 'advance_payment', 'jazzcash', true, 3)
ON CONFLICT (method_key) DO NOTHING;