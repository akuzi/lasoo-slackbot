const { createHmac } = require('crypto');
const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// Verify Slack request signature
function verifySlackRequest(req) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const body = req.body || '';
  
  // Prevent replay attacks (check if request is older than 5 minutes)
  const currentTime = Math.floor(Date.now() / 1000);
  if (Math.abs(currentTime - parseInt(timestamp)) > 300) {
    return false;
  }
  
  const sigBasestring = `v0:${timestamp}:${body}`;
  const mySignature = 'v0=' + createHmac('sha256', process.env.SLACK_SIGNING_SECRET)
    .update(sigBasestring)
    .digest('hex');
  
  return createHmac('sha256', mySignature)
    .update(sigBasestring)
    .digest('hex') === signature.split('=')[1];
}

// Parse URL-encoded form data
function parseFormData(body) {
  const params = new URLSearchParams(body);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse body (Vercel may send it as a string)
  const body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const formData = parseFormData(body);
  
  // Verify request (for production, uncomment this)
  // if (!verifySlackRequest(req)) {
  //   return res.status(401).json({ error: 'Unauthorized' });
  // }

  const { command, text, user_id, channel_id, response_url } = formData;

  console.log('Received command:', command, 'from user:', user_id);

  try {
    switch (command) {
      case '/hello':
        await web.chat.postMessage({
          channel: channel_id,
          text: `Hello <@${user_id}>! 👋\nYou said: ${text || 'nothing'}`,
        });
        res.status(200).json({ response_type: 'ephemeral', text: 'Hello command executed!' });
        break;

      case '/help':
        await web.chat.postMessage({
          channel: channel_id,
          text: `Available commands:\n• /hello - Say hello\n• /help - Show this help message`,
        });
        res.status(200).json({ response_type: 'ephemeral', text: 'Help command executed!' });
        break;

      default:
        res.status(200).json({ 
          response_type: 'ephemeral', 
          text: `Unknown command: ${command}` 
        });
    }
  } catch (error) {
    console.error('Error handling command:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

