const { createHmac } = require('crypto');
const { WebClient } = require('@slack/web-api');

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

// Verify Slack request signature
function verifySlackRequest(req) {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const body = req.body || '';
  
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

  const payload = JSON.parse(formData.payload);
  const { type, user, actions, response_url } = payload;

  console.log('Received interaction:', type);

  try {
    switch (type) {
      case 'button_click':
        // Handle button clicks
        if (actions && actions[0]) {
          const action = actions[0];
          
          await web.chat.postMessage({
            channel: payload.channel.id,
            text: `<@${user.id}> clicked the button: ${action.value}`,
          });
          
          res.status(200).json({
            text: 'Button clicked!',
            replace_original: false,
          });
        }
        break;

      case 'block_actions':
        // Handle block actions
        res.status(200).json({
          text: 'Block action received!',
          replace_original: false,
        });
        break;

      case 'view_submission':
        // Handle modal submissions
        res.status(200).json({
          response_action: 'clear',
        });
        break;

      default:
        res.status(200).json({ text: 'Interaction received' });
    }
  } catch (error) {
    console.error('Error handling interaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

