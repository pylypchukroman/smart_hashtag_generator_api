# Smart Hashtag Generator API

Node.js + Express backend for generating social media hashtags with the OpenAI API.

## Project Structure

```text
src/
  app.js
  server.js
  controllers/
    hashtagController.js
  middleware/
    errorHandler.js
  routes/
    hashtagRoutes.js
  services/
    openaiService.js
```

## Setup

```bash
npm install
cp .env.example .env
```

Add your backend-only OpenAI API key to `.env`:

```env
OPENAI_API_KEY=your_api_key_here
```

Start the API:

```bash
npm run dev
```

By default, the API runs at `http://localhost:5050`.

## Environment Variables

```env
PORT=5050
CLIENT_ORIGIN=http://localhost:3000
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
```

Use `CLIENT_ORIGIN` to allow your React app through CORS. For Vite, this is often `http://localhost:5173`. Multiple origins can be comma-separated:

```env
CLIENT_ORIGIN=http://localhost:3000,http://localhost:5173
```

## API

### `POST /api/generate-hashtags`

Request:

```json
{
  "topic": "fitness tips"
}
```

Response:

```json
{
  "hashtags": ["#FitnessTips", "#HealthyLifestyle"]
}
```

Validation error:

```json
{
  "error": "Topic is required."
}
```

## Connect React Frontend

Remove any OpenAI API calls and API keys from React. React should call this backend only.

Example:

```js
async function generateHashtags(topic) {
  const response = await fetch('http://localhost:5050/api/generate-hashtags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate hashtags');
  }

  return data.hashtags;
}
```

For deployment, set your React app API base URL to the deployed backend URL. Keep `OPENAI_API_KEY` only in the backend environment, never in React `.env` files.
