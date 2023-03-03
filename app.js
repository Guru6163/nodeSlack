const express = require('express');
const { WebClient } = require('@slack/web-api');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const SPAM_NOTIFICATION_TYPES = ['SpamNotification'];



app.use(express.json());

app.post('/spamChecker', async (req, res) => {
  const payload = req.body;
  console.log(payload)
  if (payload.Type == SPAM_NOTIFICATION_TYPES) {
    const email = payload.Email;
    const message = `New spam alert from ${email}`;
    const client = new WebClient( payload.token);
    try {
      const result = await client.chat.postMessage({
        channel: '#general',
        text: message,
      });
      return res.send(`Slack notification sent successfully: ${JSON.stringify(result.message.text)}`);
    } catch (error) {
      return res.status(500).send(`Error sending Slack notification: ${error}`);
    }
  } else {
    return res.send('Payload does not match desired criteria.');
  }
});

const port = process.env.PORT || 4000;


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


