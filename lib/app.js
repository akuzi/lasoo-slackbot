const { App } = require('@slack/bolt');

// Create a Bolt app instance configured for serverless
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  processBeforeResponse: true, // Required for serverless functions
});

// Handle app mentions
app.event('app_mention', async ({ event, client }) => {
  console.log('Received app_mention event:', event);
  
  try {
    await client.chat.postMessage({
      channel: event.channel,
      text: `Hello <@${event.user}>! 👋 How can I help you today?`,
    });
  } catch (error) {
    console.error('Error posting message:', error);
  }
});

// Handle messages
app.message(async ({ message, say }) => {
  // Ignore bot messages and messages without text
  if (message.subtype || !message.text) {
    return;
  }
  
  console.log('Received message event:', message);
  
  // Add your message handling logic here
});

// Handle /hello command
app.command('/hello', async ({ command, ack, respond, client }) => {
  await ack();
  
  console.log('Received /hello command from user:', command.user_id);
  
  try {
    await client.chat.postMessage({
      channel: command.channel_id,
      text: `Hello <@${command.user_id}>! 👋\nYou said: ${command.text || 'nothing'}`,
    });
    await respond({ response_type: 'ephemeral', text: 'Hello command executed!' });
  } catch (error) {
    console.error('Error handling /hello command:', error);
    await respond({ response_type: 'ephemeral', text: 'Error executing command' });
  }
});

// Handle /help command
app.command('/help', async ({ command, ack, respond, client }) => {
  await ack();
  
  console.log('Received /help command from user:', command.user_id);
  
  try {
    await client.chat.postMessage({
      channel: command.channel_id,
      text: `Available commands:\n• /hello - Say hello\n• /help - Show this help message`,
    });
    await respond({ response_type: 'ephemeral', text: 'Help command executed!' });
  } catch (error) {
    console.error('Error handling /help command:', error);
    await respond({ response_type: 'ephemeral', text: 'Error executing command' });
  }
});

// Handle button clicks
app.action('button_click', async ({ action, body, ack, respond, client }) => {
  await ack();
  
  console.log('Received button click:', action);
  
  try {
    await client.chat.postMessage({
      channel: body.channel.id,
      text: `<@${body.user.id}> clicked the button: ${action.value}`,
    });
    await respond({ text: 'Button clicked!', replace_original: false });
  } catch (error) {
    console.error('Error handling button click:', error);
    await respond({ text: 'Error handling button click' });
  }
});

// Handle block actions
app.action(/.*/, async ({ action, ack, respond }) => {
  await ack();
  
  console.log('Received block action:', action);
  
  await respond({ text: 'Block action received!', replace_original: false });
});

// Handle view submissions (modals)
// Note: Use callback_id pattern for specific modals, or use a regex for all
app.view(/.*/, async ({ ack }) => {
  await ack({
    response_action: 'clear',
  });
});

// Error handler
app.error(async (error) => {
  console.error('Bolt app error:', error);
});

module.exports = app;

