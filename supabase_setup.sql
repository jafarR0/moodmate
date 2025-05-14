-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Mental Health Entries Table
CREATE TABLE IF NOT EXISTS mental_health_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    -- Basic fields
    mood TEXT NOT NULL,
    thoughts TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    
    -- Additional survey questions
    sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 5),
    energy_level INTEGER CHECK (energy_level >= 1 AND energy_level <= 5),
    stress_level INTEGER CHECK (stress_level >= 1 AND stress_level <= 5),
    anxiety_level INTEGER CHECK (anxiety_level >= 1 AND anxiety_level <= 5),
    social_interaction TEXT,
    physical_activity TEXT,
    gratitude_notes TEXT,
    goals_today TEXT,
    
    -- Analysis data
    sentiment_score FLOAT,
    
    -- Timestamps
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_mental_health_entries_user_id ON mental_health_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mental_health_entries_date ON mental_health_entries(date);
CREATE INDEX IF NOT EXISTS idx_mental_health_entries_user_date ON mental_health_entries(user_id, date);

-- Row Level Security (RLS)
ALTER TABLE mental_health_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Read Policy: Users can only view their own entries
CREATE POLICY "Users can view their own entries"
    ON mental_health_entries
    FOR SELECT
    USING (auth.uid() = user_id);

-- Insert Policy: Users can only insert their own entries
CREATE POLICY "Users can insert their own entries"
    ON mental_health_entries
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Update Policy: Users can only update their own entries
CREATE POLICY "Users can update their own entries"
    ON mental_health_entries
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Delete Policy: Users can only delete their own entries
CREATE POLICY "Users can delete their own entries"
    ON mental_health_entries
    FOR DELETE
    USING (auth.uid() = user_id);

-- Optional: Create a view for user statistics
CREATE OR REPLACE VIEW user_mental_health_stats AS
SELECT
    user_id,
    COUNT(*) as total_entries,
    AVG(rating) as avg_rating,
    AVG(sentiment_score) as avg_sentiment,
    AVG(sleep_quality) as avg_sleep_quality,
    AVG(energy_level) as avg_energy_level,
    AVG(stress_level) as avg_stress_level,
    AVG(anxiety_level) as avg_anxiety_level,
    MIN(date) as first_entry_date,
    MAX(date) as last_entry_date
FROM
    mental_health_entries
GROUP BY
    user_id;

-- Drop the function and trigger that limit entries to one per day
DROP TRIGGER IF EXISTS enforce_daily_entry ON mental_health_entries;
DROP FUNCTION IF EXISTS check_daily_entry(); 