# Setting Up Hugging Face API for Sentiment Analysis

This guide will help you get a free API token from Hugging Face to use for sentiment analysis in your mental health tracking app.

## What is Hugging Face?

Hugging Face is a platform that provides free access to thousands of machine learning models, including sentiment analysis models. Their free tier allows for a reasonable number of API calls - more than enough for personal projects.

## Step 1: Create a Hugging Face Account

1. Go to [Hugging Face](https://huggingface.co/) and click "Sign Up" in the top right corner
2. You can sign up with your email, Google, or GitHub account
3. Complete the registration process

## Step 2: Generate an API Token

1. Log in to your Hugging Face account
2. Go to your profile settings by clicking on your profile picture in the top right corner and selecting "Settings"
3. In the left sidebar, click on "Access Tokens"
4. Click the "New token" button
5. Give your token a name (e.g., "Mental Health App")
6. Select "Read" access (that's all you need for inference)
7. Click "Generate a token"
8. Copy the generated token immediately - you won't be able to see it again!

## Step 3: Update Your App Configuration

1. Open your project's `js/config.js` file
2. Find the line that says:
   ```javascript
   const HUGGING_FACE_TOKEN = "hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
   ```
3. Replace the placeholder token with your actual token:
   ```javascript
   const HUGGING_FACE_TOKEN = "hf_abcdefghijklmnopqrstuvwxyz123456";
   ```

## Step 4: Test Your Integration

1. Set `USE_MOCK_API` to `false` in your `config.js` file
2. Open your app and enter some text in the "Share your thoughts" field
3. Click the "Test Sentiment" button
4. You should see the sentiment analysis result appear below the text area

## Troubleshooting

If you encounter any issues:

### Common Error Codes:

- **401 Error**: Your API token is invalid or has expired. Generate a new token.
- **404 Error**: The model couldn't be found. This might be due to:
  - The model name has changed
  - You don't have access to the model
  - There's a typo in the model ID
- **429 Error**: You've hit the rate limits. Wait a bit before trying again.

### CORS Issues

If you're hosting your site on a domain, Hugging Face might block requests due to CORS policies. Solutions:

1. **Use a CORS Proxy**:
   - Uncomment the CORS_PROXY line in the sentiment.js file
   - Get a free CORS proxy like [cors-anywhere](https://cors-anywhere.herokuapp.com/) or set up your own

2. **Create a Simple Backend**:
   - If you're comfortable with Node.js, create a simple proxy server
   - This server will make requests to Hugging Face on behalf of your frontend

### If Nothing Works

The app will automatically fall back to local sentiment analysis if the API fails, so users will still get a response. You can set `USE_MOCK_API` to `true` in your `config.js` file to use the local analysis exclusively.

## API Model Information

The app is configured to use `finiteautomata/bertweet-base-sentiment-analysis`, a sentiment analysis model fine-tuned on Twitter data. It's particularly good at analyzing short, informal text like the kind users might enter in your app.

This model classifies text as:
- POS (Positive)
- NEG (Negative)
- NEU (Neutral)

For more information, visit the [model card](https://huggingface.co/finiteautomata/bertweet-base-sentiment-analysis) on Hugging Face. 