import 'dotenv/config';

import app from './app.js';

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Smart Hashtag Generator API running on port ${PORT}`);
});
