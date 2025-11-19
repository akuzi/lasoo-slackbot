# Lasoo Slack Bot

A basic Slack bot built with Node.js and deployable to Vercel.

## Features

- Handle Slack events (mentions, messages)
- Process slash commands
- Handle interactive components (buttons, modals)
- Deployable to Vercel as serverless functions

## Prerequisites

- Node.js 18+ installed
- A Slack app created at [api.slack.com](https://api.slack.com/apps)
- A Vercel account (free tier works)

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Slack credentials:
   - `SLACK_BOT_TOKEN`: Your bot token (starts with `xoxb-`)
   - `SLACK_SIGNING_SECRET`: Your app's signing secret

3. **Run locally:**
   ```bash
   npm run dev
   ```

4. **Set up Slack Event Subscriptions:**
   - Go to your Slack app settings
   - Navigate to "Event Subscriptions"
   - Set Request URL to: `https://your-ngrok-url.ngrok.io/api/events`
   - Subscribe to bot events: `app_mention`, `message.channels`
   - Save changes

5. **Set up Slash Commands:**
   - Go to "Slash Commands" in your Slack app settings
   - Create commands like `/hello` and `/help`
   - Set Request URL to: `https://your-ngrok-url.ngrok.io/api/commands`

6. **Set up Interactive Components:**
   - Go to "Interactive Components" in your Slack app settings
   - Set Request URL to: `https://your-ngrok-url.ngrok.io/api/interactions`

## Deployment to Vercel

1. **Install Vercel CLI (if not already installed):**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Set environment variables in Vercel:**
   - Go to your project settings in Vercel dashboard
   - Navigate to "Environment Variables"
   - Add:
     - `SLACK_BOT_TOKEN`: Your bot token
     - `SLACK_SIGNING_SECRET`: Your signing secret

4. **Update Slack app URLs:**
   - Update Event Subscriptions URL to: `https://your-app.vercel.app/api/events`
   - Update Slash Commands URL to: `https://your-app.vercel.app/api/commands`
   - Update Interactive Components URL to: `https://your-app.vercel.app/api/interactions`

## Project Structure

```
lasoo-slackbot/
├── api/
│   ├── events.js       # Handles Slack events (mentions, messages)
│   ├── commands.js     # Handles slash commands
│   └── interactions.js # Handles interactive components
├── package.json
├── vercel.json         # Vercel configuration
├── .env.example        # Example environment variables
├── .gitignore
└── README.md
```

## Customization

- Edit `api/events.js` to customize event handling
- Edit `api/commands.js` to add/modify slash commands
- Edit `api/interactions.js` to handle button clicks, modals, etc.

## Security Notes

- The signature verification is commented out in the code. Uncomment it for production use.
- Never commit your `.env` file to version control.
- Use Vercel's environment variables for production secrets.

## License

MIT

