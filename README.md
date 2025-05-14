# MindBalance: Mental Health Tracking Web Application

## Overview
MindBalance is a modern web application designed to help users track their mental health, analyze their mood and thoughts using sentiment analysis, and receive personalized recommendations, including helpful videos and professional contacts. The app emphasizes privacy, ease of use, and actionable insights for self-improvement.

---

## Features
- **Daily Mental Health Survey**: Users can log their mood, thoughts, and rate their day, along with additional metrics like sleep quality, energy, stress, and anxiety levels.
- **Sentiment Analysis**: User thoughts are analyzed using a sentiment analysis model (Hugging Face API or local fallback) to provide feedback and track emotional trends.
- **Personalized Recommendations**:
  - **Video Recommendations**: Curated YouTube videos based on the user's current sentiment.
  - **Doctor Recommendations**: Randomly selected mental health professionals for support.
- **Historical Tracking**:
  - **Timeline**: View past entries in an expandable timeline with all recorded metrics and notes.
  - **Sentiment Graph**: Visualize trends in sentiment and mood ratings over time.
- **Authentication**: Secure login and registration using Supabase Auth.
- **Responsive UI**: Clean, modern, and mobile-friendly interface.

---

## Tech Stack
- **Frontend**: HTML, CSS (custom, modular), JavaScript (ES6 modules)
- **Backend/API**: Supabase (database & authentication), Hugging Face API (sentiment analysis), optional FastAPI backend for advanced use
- **Visualization**: Chart.js for sentiment/mood graphs

---

## Project Structure
```
├── index.html                # Main HTML file
├── css/
│   └── components/
│       └── survey.css        # Main styles for survey and results
│   └── style.css            # Global styles
├── js/
│   ├── config.js            # App configuration (Supabase, API keys, categories)
│   ├── survey.js            # Main app logic (form, timeline, graph)
│   ├── sentiment.js         # Sentiment analysis logic (API & local)
│   ├── recommendations.js   # Video/doctor recommendation logic
│   └── auth.js              # Authentication logic
├── backend/
│   └── app.py               # (Optional) FastAPI backend for advanced sentiment analysis
│   └── requirements.txt     # Backend dependencies
├── huggingface_setup.md     # Guide for Hugging Face API setup
└── README.md                # This file
```

---

## Setup & Installation

### 1. Clone the Repository
```bash
git clone <repo-url>
cd <repo-directory>
```

### 2. Supabase Setup
- Create a [Supabase](https://supabase.com) project.
- Copy your Supabase URL and anon key into `js/config.js`.
- Set up the `mental_health_entries` table with the following fields:
  - `id` (UUID, primary key)
  - `user_id` (UUID, foreign key to auth.users)
  - `date` (timestamp)
  - `mood` (text)
  - `thoughts` (text)
  - `rating` (integer)
  - `sentiment_score` (float)
  - `sleep_quality`, `energy_level`, `stress_level`, `anxiety_level` (integer)
  - `social_interaction`, `physical_activity`, `gratitude_notes`, `goals_today` (text)
- Enable Row Level Security (RLS) and set policies to allow users to access only their own entries.

### 3. Hugging Face API (Optional, for advanced sentiment analysis)
- Follow `huggingface_setup.md` to get a free API token.
- Paste your token into `js/config.js`.
- Set `USE_MOCK_API` to `false` to use the Hugging Face API, or `true` to use the local fallback.

### 4. (Optional) Backend Setup
- If you want to run your own backend for sentiment analysis:
  - Install Python dependencies:
    ```bash
    pip install -r backend/requirements.txt
    ```
  - Run the FastAPI server:
    ```bash
    uvicorn backend.app:app --reload
    ```

### 5. Run the App
- Open `index.html` in your browser (use a local server for best results, e.g., `Live Server` extension or `python -m http.server`).

---

## Usage
1. **Register/Login**: Create an account or log in.
2. **Fill Out the Survey**: Enter your mood, thoughts, and all additional metrics.
3. **Submit**: View your sentiment analysis, recommendations, and see your entry added to the timeline and graph.
4. **Explore History**: Click on timeline entries to expand and view all details for each report.
5. **Review Recommendations**: Watch suggested videos or consider contacting recommended professionals.

---

## Major Components

### Sentiment Analysis
- Uses Hugging Face API (or local fallback) to analyze user thoughts.
- Returns compound, positive, negative, and neutral scores.
- Categorizes sentiment as positive, negative, or neutral for recommendations.

### Video Recommendations
- Based on sentiment, recommends relevant YouTube videos (motivation, mindfulness, anxiety relief, etc.).
- Videos are displayed with thumbnails and direct links.

### Doctor Recommendations
- Randomly selects mental health professionals from a predefined list for user support.

### Timeline & Graph
- Timeline shows all previous entries, expandable for full details.
- Chart.js graph visualizes sentiment and mood rating trends over time.

---

## Customization
- **Add More Videos/Doctors**: Edit `js/recommendations.js` and `js/config.js`.
- **Change Survey Questions**: Edit the form in `index.html` and update handling in `js/survey.js`.
- **Styling**: Modify CSS in `css/components/survey.css` and `css/style.css`.

---

## Troubleshooting
- **Supabase Errors**: Check API keys, RLS policies, and table structure.
- **Sentiment API Issues**: Use the local fallback or check your Hugging Face token.
- **UI Bugs**: Use browser dev tools to inspect and debug.

---

## License
This project is for educational and personal use. Please review third-party API terms (Supabase, Hugging Face, YouTube) before deploying publicly.

---

## Credits
- [Supabase](https://supabase.com)
- [Hugging Face](https://huggingface.co)
- [Chart.js](https://www.chartjs.org/)
- [YouTube](https://youtube.com)

---

## Contact
For questions or suggestions, please open an issue or contact the project maintainer. 