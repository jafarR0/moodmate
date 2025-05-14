import { supabase, SENTIMENT_API_URL } from './config.js';
import { analyzeSentiment, formatSentimentScore } from './sentiment.js';
import { updateRecommendations } from './recommendations.js';
import { showError } from './auth.js';

// DOM Elements
const mentalHealthForm = document.getElementById('mental-health-form');
const ratingInput = document.getElementById('rating');
const ratingValue = document.getElementById('rating-value');
const resultsSection = document.getElementById('results-section');
const sentimentScore = document.getElementById('sentiment-score');
const entriesTimeline = document.getElementById('entries-timeline');
const testSentimentButton = document.getElementById('test-sentiment');
const testSentimentResult = document.getElementById('test-sentiment-result');

// Add some example sentiments for testing
const exampleSentiments = [
    { text: "Today was a great day! I feel so happy and energetic.", label: "Positive" },
    { text: "I'm feeling really sad and upset today. Nothing is going right.", label: "Negative" },
    { text: "It was an average day, nothing special happened.", label: "Neutral" }
];

// Update rating value display
ratingInput.addEventListener('input', (e) => {
    ratingValue.textContent = e.target.value;
});

// Add event listeners for range inputs
const rangeInputs = [
    { input: 'sleep-quality', value: 'sleep-quality-value' },
    { input: 'energy-level', value: 'energy-level-value' },
    { input: 'stress-level', value: 'stress-level-value' },
    { input: 'anxiety-level', value: 'anxiety-level-value' }
];

rangeInputs.forEach(({ input, value }) => {
    const inputElement = document.getElementById(input);
    const valueElement = document.getElementById(value);
    
    if (inputElement && valueElement) {
        inputElement.addEventListener('input', (e) => {
            valueElement.textContent = e.target.value;
        });
    }
});

// Add example sentiment links if test button exists
if (testSentimentButton) {
    // Add example sentiment links
    const examplesDiv = document.createElement('div');
    examplesDiv.className = 'sentiment-examples';
    examplesDiv.innerHTML = `
        <p class="examples-title">Try these examples:</p>
        <div class="examples-links">
            ${exampleSentiments.map((example, index) => 
                `<a href="#" class="example-link" data-index="${index}">${example.label}</a>`
            ).join(' | ')}
        </div>
    `;
    
    // Insert after test button
    testSentimentButton.insertAdjacentElement('afterend', examplesDiv);
    
    // Add event listeners to example links
    document.querySelectorAll('.example-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(e.target.dataset.index);
            const example = exampleSentiments[index];
            document.getElementById('thoughts').value = example.text;
            
            // Auto-trigger sentiment analysis
            testSentimentButton.click();
        });
    });
}

// Test sentiment button handler
if (testSentimentButton) {
    testSentimentButton.addEventListener('click', async () => {
        const thoughtsText = document.getElementById('thoughts').value.trim();
        
        if (!thoughtsText) {
            testSentimentResult.textContent = 'Please enter some text first.';
            testSentimentResult.className = 'sentiment-test-error';
            testSentimentResult.classList.remove('hidden');
            return;
        }
        
        try {
            // Show loading state
            testSentimentButton.disabled = true;
            testSentimentButton.textContent = 'Analyzing...';
            testSentimentResult.textContent = 'Analyzing your text...';
            testSentimentResult.className = 'sentiment-test-loading';
            testSentimentResult.classList.remove('hidden');
            
            // Get sentiment analysis
            const sentimentData = await analyzeSentiment(thoughtsText);
            console.log('Sentiment test results:', sentimentData);
            const formattedResult = formatSentimentScore(sentimentData.compound);
            
            // Display result with more detailed information
            testSentimentResult.innerHTML = `
                <div class="sentiment-result ${formattedResult.description}">
                    <span class="sentiment-emoji">${formattedResult.emoji}</span>
                    <div class="sentiment-details">
                        <span class="sentiment-text">Your text appears to be <strong>${formattedResult.description}</strong> (${formattedResult.percentage}%)</span>
                        <div class="sentiment-breakdown">
                            <div class="sentiment-bar-container">
                                <div class="sentiment-label">Positive:</div>
                                <div class="sentiment-bar-bg">
                                    <div class="sentiment-bar positive" style="width: ${(sentimentData.pos * 100).toFixed(1)}%"></div>
                                </div>
                                <div class="sentiment-value">${(sentimentData.pos * 100).toFixed(1)}%</div>
                            </div>
                            <div class="sentiment-bar-container">
                                <div class="sentiment-label">Negative:</div>
                                <div class="sentiment-bar-bg">
                                    <div class="sentiment-bar negative" style="width: ${(sentimentData.neg * 100).toFixed(1)}%"></div>
                                </div>
                                <div class="sentiment-value">${(sentimentData.neg * 100).toFixed(1)}%</div>
                            </div>
                            <div class="sentiment-bar-container">
                                <div class="sentiment-label">Neutral:</div>
                                <div class="sentiment-bar-bg">
                                    <div class="sentiment-bar neutral" style="width: ${(sentimentData.neu * 100).toFixed(1)}%"></div>
                                </div>
                                <div class="sentiment-value">${(sentimentData.neu * 100).toFixed(1)}%</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            testSentimentResult.className = 'sentiment-test-result';
        } catch (error) {
            console.error('Test sentiment error:', error);
            testSentimentResult.textContent = 'Error analyzing sentiment. Please try again.';
            testSentimentResult.className = 'sentiment-test-error';
        } finally {
            testSentimentButton.disabled = false;
            testSentimentButton.textContent = 'Test Sentiment';
        }
    });
}

// Form submission handler
mentalHealthForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
            throw new Error('You must be logged in to submit entries. Please log in and try again.');
        }

        const formData = {
            user_id: session.user.id,
            mood: document.getElementById('mood').value,
            thoughts: document.getElementById('thoughts').value,
            rating: parseInt(ratingInput.value),
            // Add all the additional metrics
            sleep_quality: parseInt(document.getElementById('sleep-quality').value),
            energy_level: parseInt(document.getElementById('energy-level').value),
            stress_level: parseInt(document.getElementById('stress-level').value),
            anxiety_level: parseInt(document.getElementById('anxiety-level').value),
            social_interaction: document.getElementById('social-interaction').value,
            physical_activity: document.getElementById('physical-activity').value,
            gratitude_notes: document.getElementById('gratitude-notes').value,
            goals_today: document.getElementById('goals-today').value,
            date: new Date().toISOString()
        };

        // Show loading state
        const submitButton = mentalHealthForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Processing...';
        submitButton.disabled = true;

        // Get sentiment analysis using our function instead of direct fetch
        const sentimentData = await analyzeSentiment(formData.thoughts);
        formData.sentiment_score = sentimentData.compound;

        // Save to Supabase
        const { data, error } = await supabase
            .from('mental_health_entries')
            .insert([formData]);

        if (error) {
            console.error('Supabase insert error details:', error);
            if (error.code === '42501' || error.message.includes('violates row-level security policy')) {
                throw new Error('Permission denied. Make sure you are logged in and have the correct permissions.');
            } else {
                throw error;
            }
        }

        // Show results
        displayResults(formData);
        
        // Clear form and test results
        mentalHealthForm.reset();
        ratingValue.textContent = '5';
        // Reset all range values
        document.getElementById('sleep-quality-value').textContent = '3';
        document.getElementById('energy-level-value').textContent = '3';
        document.getElementById('stress-level-value').textContent = '3';
        document.getElementById('anxiety-level-value').textContent = '3';
        
        if (testSentimentResult) {
            testSentimentResult.classList.add('hidden');
        }
        
        // Refresh timeline
        await loadEntries();

    } catch (error) {
        console.error('Form submission error:', error);
        showError(error.message || 'Failed to submit your entry. Please try again.');
    } finally {
        // Reset button state
        const submitButton = mentalHealthForm.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.textContent = 'Submit';
            submitButton.disabled = false;
        }
    }
});

// Display results after submission
function displayResults(data) {
    resultsSection.classList.remove('hidden');
    
    // Display sentiment score with emoji
    let emoji = '😐';
    if (data.sentiment_score > 0.05) emoji = '😊';
    if (data.sentiment_score < -0.05) emoji = '😔';
    
    // Use absolute value for percentage display
    const sentimentPercentage = Math.abs((data.sentiment_score * 100).toFixed(1));
    const sentimentType = data.sentiment_score > 0.05 ? 'positive' : 
                          data.sentiment_score < -0.05 ? 'negative' : 'neutral';
    
    sentimentScore.textContent = `Sentiment Analysis ${emoji}: ${sentimentType} (${sentimentPercentage}%)`;
    
    // Update recommendations based on sentiment
    updateRecommendations(data.sentiment_score);
}

// Load and display previous entries
async function loadEntries() {
    try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
            entriesTimeline.innerHTML = '<p>Please log in to view your entries.</p>';
            return;
        }

        const { data, error } = await supabase
            .from('mental_health_entries')
            .select('*')
            .order('date', { ascending: true })
            .limit(30);

        if (error) throw error;

        if (data && data.length > 0) {
            // Create sentiment graph
            createSentimentGraph(data);
            
            // Display entries in timeline
            entriesTimeline.innerHTML = data.map(entry => {
                // Determine sentiment emoji
                let emoji = '😐';
                if (entry.sentiment_score > 0.05) emoji = '😊';
                if (entry.sentiment_score < -0.05) emoji = '😔';
                
                // Format sentiment description
                const sentimentPercentage = Math.abs((entry.sentiment_score * 100).toFixed(1));
                const sentimentType = entry.sentiment_score > 0.05 ? 'positive' : 
                                     entry.sentiment_score < -0.05 ? 'negative' : 'neutral';
                
                // Format additional metrics
                const sleepQuality = entry.sleep_quality ? `${entry.sleep_quality}/5` : 'Not recorded';
                const energyLevel = entry.energy_level ? `${entry.energy_level}/5` : 'Not recorded';
                const stressLevel = entry.stress_level ? `${entry.stress_level}/5` : 'Not recorded';
                const anxietyLevel = entry.anxiety_level ? `${entry.anxiety_level}/5` : 'Not recorded';
                
                return `
                    <div class="timeline-entry" onclick="this.classList.toggle('expanded')">
                        <div class="entry-header">
                            <div class="entry-date">${new Date(entry.date).toLocaleDateString()} ${new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                            <div class="entry-mood">Mood: ${entry.mood}</div>
                            <div class="entry-rating">Rating: ${entry.rating}/10</div>
                            <div class="entry-sentiment">${emoji} Sentiment: ${sentimentType} (${sentimentPercentage}%)</div>
                            <div class="expand-indicator">▼</div>
                        </div>
                        <div class="entry-details">
                            <div class="entry-thoughts">
                                <h4>Your Thoughts</h4>
                                <p>${entry.thoughts}</p>
                            </div>
                            <div class="entry-metrics">
                                <div class="metric">
                                    <span class="metric-label">Sleep Quality:</span>
                                    <span class="metric-value">${sleepQuality}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Energy Level:</span>
                                    <span class="metric-value">${energyLevel}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Stress Level:</span>
                                    <span class="metric-value">${stressLevel}</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Anxiety Level:</span>
                                    <span class="metric-value">${anxietyLevel}</span>
                                </div>
                            </div>
                            ${entry.social_interaction ? `
                                <div class="entry-activity">
                                    <h4>Social Interaction</h4>
                                    <p>${entry.social_interaction}</p>
                                </div>
                            ` : ''}
                            ${entry.physical_activity ? `
                                <div class="entry-activity">
                                    <h4>Physical Activity</h4>
                                    <p>${entry.physical_activity}</p>
                                </div>
                            ` : ''}
                            ${entry.gratitude_notes ? `
                                <div class="entry-gratitude">
                                    <h4>Gratitude Notes</h4>
                                    <p>${entry.gratitude_notes}</p>
                                </div>
                            ` : ''}
                            ${entry.goals_today ? `
                                <div class="entry-goals">
                                    <h4>Goals for the Day</h4>
                                    <p>${entry.goals_today}</p>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            entriesTimeline.innerHTML = '<p>No entries yet. Submit your first entry to see it here!</p>';
        }

    } catch (error) {
        console.error('Error loading entries:', error);
        showError('Failed to load your entries. Please refresh the page.');
    }
}

// Create sentiment graph using Chart.js
function createSentimentGraph(entries) {
    const ctx = document.getElementById('sentiment-graph').getContext('2d');
    
    // Prepare data for the graph
    const dates = entries.map(entry => new Date(entry.date).toLocaleDateString());
    const sentimentScores = entries.map(entry => entry.sentiment_score);
    const ratings = entries.map(entry => entry.rating / 10); // Normalize rating to 0-1 scale
    
    // Destroy existing chart if it exists
    if (window.sentimentChart) {
        window.sentimentChart.destroy();
    }
    
    // Create new chart
    window.sentimentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Sentiment Score',
                    data: sentimentScores,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                },
                {
                    label: 'Mood Rating (normalized)',
                    data: ratings,
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    min: -1,
                    max: 1,
                    title: {
                        display: true,
                        text: 'Score'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Sentiment and Mood Trends'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            if (label.includes('Sentiment')) {
                                return `${label}: ${(value * 100).toFixed(1)}%`;
                            }
                            return `${label}: ${(value * 10).toFixed(1)}/10`;
                        }
                    }
                }
            }
        }
    });
}

// Load entries on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is authenticated before loading entries
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
        loadEntries();
    } else {
        entriesTimeline.innerHTML = '<p>Please log in to view your entries.</p>';
    }
});

// Export functions
export {
    loadEntries
}; 