-- 1. Enable Row Level Security (The Firewall)
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;

-- 2. Create Policy: Allow public to INSERT (Logging data)
-- This allows any user (anonymous or logged in) to save their journey steps.
CREATE POLICY "Allow public insert"
ON public.user_journeys
FOR INSERT
TO public
WITH CHECK (true);

-- 3. Create Policy: Allow ONLY Service Role to SELECT (Reading data)
-- This prevents public users from reading/downloading the analytics data.
-- Only your dashboard or backend code (using service_role key) can read it.
CREATE POLICY "Allow service_role read only"
ON public.user_journeys
FOR SELECT
TO service_role
USING (true);
