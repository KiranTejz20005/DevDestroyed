-- SQL script to create the 'roasts' table in Supabase

CREATE TABLE IF NOT EXISTS roasts (
    username TEXT PRIMARY KEY,
    avatar TEXT,
    languages JSONB,
    questions JSONB,
    roast TEXT,
    strength TEXT,
    weakness TEXT,
    love_life TEXT,
    life_purpose TEXT,
    questions_seen BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS (Optional, but recommended)
ALTER TABLE roasts ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read roasts
CREATE POLICY "Allow public read access" ON roasts
    FOR SELECT USING (true);

-- Create a policy that allows the service role (backend) to insert/update
CREATE POLICY "Allow service role insert/update" ON roasts
    FOR ALL USING (auth.role() = 'service_role');
