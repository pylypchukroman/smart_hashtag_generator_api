import OpenAI from 'openai';

export async function generateHashtagsForTopic(topic) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY is not configured.');
    error.statusCode = 500;
    throw error;
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const completion = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content:
          'You generate relevant social media hashtags. Return only valid JSON with this shape: {"hashtags":["#example"]}. No markdown.',
      },
      {
        role: 'user',
        content: `Generate 10 relevant social media hashtags for this topic: ${topic}`,
      },
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' },
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    const error = new Error('OpenAI returned an empty response.');
    error.statusCode = 502;
    throw error;
  }

  const parsed = parseOpenAIResponse(content);
  const hashtags = normalizeHashtags(parsed.hashtags);

  if (!hashtags.length) {
    const error = new Error('OpenAI returned no hashtags.');
    error.statusCode = 502;
    throw error;
  }

  return hashtags;
}

function parseOpenAIResponse(content) {
  try {
    return JSON.parse(content);
  } catch {
    const error = new Error('OpenAI returned invalid JSON.');
    error.statusCode = 502;
    throw error;
  }
}

function normalizeHashtags(hashtags) {
  if (!Array.isArray(hashtags)) {
    return [];
  }

  return hashtags
    .filter((hashtag) => typeof hashtag === 'string')
    .map((hashtag) => hashtag.trim())
    .filter(Boolean)
    .map((hashtag) => (hashtag.startsWith('#') ? hashtag : `#${hashtag}`));
}
