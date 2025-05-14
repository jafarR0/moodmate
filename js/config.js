// Supabase Configuration
// 1. Go to https://supabase.com and create a new project
// 2. Once created, go to Project Settings -> API
// 3. Copy the URL and anon key from there
const SUPABASE_URL = 'https://hdyloqcphgwfyuyvchvi.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkeWxvcWNwaGd3Znl1eXZjaHZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTk5ODIsImV4cCI6MjA2MTE3NTk4Mn0.hc9XDHufCx0kp6RxPAMin-_XnBwI6CyotKTg1kRMU9M';

// Initialize Supabase Client with additional options
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        autoRefreshToken: true,
        persistSession: true
    }
});

// Hugging Face API Configuration
// To get a token:
// 1. Create a free account at https://huggingface.co/
// 2. Go to https://huggingface.co/settings/tokens
// 3. Click "New token" and create a token with "read" access
// 4. Copy the token and paste it here
const HUGGING_FACE_TOKEN = "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"; // Replace with your actual token

// API Configuration
// If you're having issues with the Hugging Face API, you can use our robust local implementation
// by setting USE_MOCK_API to true
const USE_MOCK_API = true; // Now using our enhanced local implementation for better results
const SENTIMENT_API_URL = 'huggingface'; // Not used directly anymore

// Doctors List (can be moved to database later)
const DOCTORS = [
    {
        name: 'Dr. Sarah Johnson',
        specialty: 'Clinical Psychologist',
        rating: 4.8,
        contact: '+1 (555) 123-4567'
    },
    {
        name: 'Dr. Michael Chen',
        specialty: 'Psychiatrist',
        rating: 4.9,
        contact: '+1 (555) 234-5678'
    },
    {
        name: 'Dr. Emily Williams',
        specialty: 'Counselor',
        rating: 4.7,
        contact: '+1 (555) 345-6789'
    }
];

// Video Categories
const VIDEO_CATEGORIES = {
    positive: ['motivation', 'mindfulness', 'happiness'],
    neutral: ['relaxation', 'meditation', 'self-care'],
    negative: ['anxiety-relief', 'depression-help', 'stress-management']
};

// Export configurations
export {
    supabase,
    SENTIMENT_API_URL,
    USE_MOCK_API,
    HUGGING_FACE_TOKEN,
    DOCTORS,
    VIDEO_CATEGORIES
}; 