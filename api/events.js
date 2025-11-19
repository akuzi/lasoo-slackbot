const { createEventAdapter } = require('@slack/events-api');
const { WebClient } = require('@slack/web-api');

const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// Handle app mentions
slackEvents.on('app_mention', async (event) => {
  console.log('Received app_mention event:', event);
  
  try {
    await web.chat.postMessage({
      channel: event.channel,
      text: `Hello <@${event.user}>! 👋 How can I help you today?`,
    });
  } catch (error) {
    console.error('Error posting message:', error);
  }
});

// Handle messages
slackEvents.on('message', async (event) => {
  // Ignore bot messages and messages without text
  if (event.subtype || !event.text) {
    return;
  }
  
  console.log('Received message event:', event);
  
  // Add your message handling logic here
});

// Error handler
slackEvents.on('error', (error) => {
  console.error('Slack events error:', error);
});

module.exports = async (req, res) => {
  // Handle Slack URL verification challenge
  if (req.method === 'POST') {
    try {
      const body = await slackEvents.requestListener(req, res);
      return;
    } catch (error) {
      console.error('Error handling event:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};

