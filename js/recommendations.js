import { DOCTORS, VIDEO_CATEGORIES } from './config.js';
import { getSentimentCategory } from './sentiment.js';

// Get doctor recommendations
function getDoctorRecommendations() {
    // Randomly select 2 doctors from the list
    const shuffled = DOCTORS.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
}

// Get video recommendations based on sentiment
function getVideoRecommendations(sentimentScore) {
    const category = getSentimentCategory(sentimentScore);
    const videoTypes = VIDEO_CATEGORIES[category];
    
    // Sample YouTube video IDs for each category
    const videos = {
        motivation: [
            { id: 'g-jwWYX7Jlo', title: 'Stay Motivated: Daily Inspiration' },
            { id: 'ZXsQAXx_ao0', title: 'Just Do It: Motivation' }
        ],
        mindfulness: [
            { id: 'inpok4MKVLM', title: '5-Minute Mindfulness Meditation' },
            { id: 'ZToicYcHIOU', title: 'Mindful Breathing Exercise' }
        ],
        'anxiety-relief': [
            { id: 'O-6f5wQXSu8', title: 'Calm Anxiety in 10 Minutes' },
            { id: 'Fpiw2hH-dlc', title: 'Relaxing Music for Stress Relief' }
        ],
        'depression-help': [
            { id: 'Rv9SwZWVkOs', title: 'Overcoming Depression: Daily Habits' },
            { id: '8Su5VtKeXU8', title: 'Depression Recovery Stories' }
        ],
        meditation: [
            { id: 'W8fQPBY_OXI', title: 'Guided Meditation for Inner Peace' },
            { id: 'ez3GgRqhNvA', title: 'Sleep Meditation Music' }
        ]
    };

    // Get random videos based on the sentiment category
    const recommendations = [];
    videoTypes.forEach(type => {
        if (videos[type]) {
            const randomVideo = videos[type][Math.floor(Math.random() * videos[type].length)];
            recommendations.push({
                ...randomVideo,
                url: `https://www.youtube.com/watch?v=${randomVideo.id}`,
                thumbnail: `https://img.youtube.com/vi/${randomVideo.id}/mqdefault.jpg`
            });
        }
    });

    return recommendations;
}

// Update recommendations in the UI
function updateRecommendations(sentimentScore) {
    const doctorRecsDiv = document.getElementById('doctor-recommendations');
    const videoRecsDiv = document.getElementById('video-recommendations');

    // Update doctor recommendations
    const doctors = getDoctorRecommendations();
    doctorRecsDiv.innerHTML = `
        <h3>Recommended Mental Health Professionals</h3>
        ${doctors.map(doctor => `
            <div class="recommendation-card">
                <h4>${doctor.name}</h4>
                <p>${doctor.specialty}</p>
                <p>⭐ ${doctor.rating}/5.0</p>
                <p>📞 ${doctor.contact}</p>
            </div>
        `).join('')}
    `;

    // Update video recommendations
    const videos = getVideoRecommendations(sentimentScore);
    videoRecsDiv.innerHTML = `
        <h3>Recommended Videos</h3>
        ${videos.map(video => `
            <div class="recommendation-card">
                <img src="${video.thumbnail}" alt="${video.title}" class="video-thumbnail">
                <h4>${video.title}</h4>
                <a href="${video.url}" target="_blank" class="video-link">Watch on YouTube</a>
            </div>
        `).join('')}
    `;
}

// Export functions
export {
    updateRecommendations,
    getDoctorRecommendations,
    getVideoRecommendations
}; 