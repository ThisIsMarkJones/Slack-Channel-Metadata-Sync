const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// 🚨 Replace with your actual Slack Workflow Trigger URL:
const WORKFLOW_TRIGGER_URL = 'https://hooks.slack.com/triggers/REPLACE_THIS';

app.post('/slack/events', async (req, res) => {
  const body = req.body;

  // ✅ Respond to Slack's initial URL verification
  if (body.type === 'url_verification') {
    return res.status(200).json({ challenge: body.challenge });
  }

  // ✅ Handle channel_created event
  if (body.event && body.event.type === 'channel_created') {
    const channel = body.event.channel;

    const payload = {
      channel_id: channel.id,
      channel_name: channel.name,
      channel_creator: channel.creator,
      channel_created_ts: String(channel.created)
    };

    try {
      await axios.post(WORKFLOW_TRIGGER_URL, payload);
      console.log('✅ Sent channel info to Slack Workflow');
    } catch (error) {
      console.error('❌ Failed to call Slack Workflow:', error.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
