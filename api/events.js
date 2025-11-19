const app = require('../lib/app');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Use Bolt's receiver to handle the request
    await app.receiver.requestListener()(req, res);
  } catch (error) {
    console.error('Error processing event:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
