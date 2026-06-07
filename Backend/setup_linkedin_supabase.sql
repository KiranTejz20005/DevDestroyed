-- SQL script to create the 'linkedin_roasts' table in Supabase

CREATE TABLE IF NOT EXISTS linkedin_roasts (
    profile_url TEXT PRIMARY KEY,
    profile_data JSONB,
    roast_data JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Optional, but recommended)
ALTER TABLE linkedin_roasts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read linkedin_roasts
CREATE POLICY "Allow public read access" ON linkedin_roasts
    FOR SELECT USING (true);

-- Create a policy that allows the service role (backend) to insert/update
CREATE POLICY "Allow service role insert/update" ON linkedin_roasts
    FOR ALL USING (auth.role() = 'service_role');
