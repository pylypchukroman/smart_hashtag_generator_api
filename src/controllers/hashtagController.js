import { generateHashtagsForTopic } from '../services/openaiService.js';

export async function generateHashtags(req, res, next) {
  try {
    const { topic } = req.body ?? {};

    if (typeof topic !== 'string' || !topic.trim()) {
      return res.status(400).json({
        error: 'Topic is required.',
      });
    }

    const hashtags = await generateHashtagsForTopic(topic.trim());

    return res.json({ hashtags });
  } catch (error) {
    return next(error);
  }
}
