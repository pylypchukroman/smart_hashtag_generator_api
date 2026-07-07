import { Router } from 'express';

import { generateHashtags } from '../controllers/hashtagController.js';

const router = Router();

router.post('/generate-hashtags', generateHashtags);

export default router;
