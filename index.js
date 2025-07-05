const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// ✅ Replace this with your actual Slack Workflow Trigger URL
const WORKFLOW_TRIGGER_URL = 'https://hooks.slack.com/triggers/REPLACE_THIS';

app.post('/slack/events', async (req, res) => {
  const body = req.body;

  // ✅ Respond to Slack's URL verification challenge
  if (body.type === 'url_verification' && body.challenge) {
    console.log('✅ Responding to Slack URL verification');
    return res.status(200).json({ challenge: body.challenge });
  }

  // ✅ Log the full incoming event for inspection
  console.log('📥 Incoming Slack event:', JSON.stringify(body, null, 2));

  // ✅ Handle channel_created event
  if (body.event && body.event.type === 'channel_created') {
    const channel = body.event.channel;

    const payload = {
      channel_id: channel?.id || 'undefined_channel_id',
      channel_name: channel?.name || 'undefined_channel_name',
      channel_creator: channel?.creator || 'undefined_creator',
      channel_created_ts: String(channel?.created || Date.now())
    };

    console.log('📦 Payload being sent to Slack Workflow:', payload);

    try {
      const response = await axios.post(WORKFLOW_TRIGGER_URL, payload);
      console.log('✅ Sent channel info to Slack Workflow, response:', response.status);
    } catch (error) {
      console.error('❌ Failed to post to Slack Workflow:', error.message);
    }
  }

  res.sendStatus(200); // Always acknowledge Slack's event
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
