// https://www.twilio.com/blog/famous-personalities-chatgpt-twilio-whatsapp-nodejs
require('dotenv').config();

const { MessagingResponse } = require('twilio').twiml;
const express = require('express');
const app = express();
app.use(express.urlencoded({
  extended: true
}));

const generatePersonalityResponse = require('./services/chatgpt.js')

app.post('/message', async (req, res) => {
    const aiResponse = await generatePersonalityResponse(req.body.Body, req.body.From)
    const twiml = new MessagingResponse();
    twiml.message(aiResponse);
    res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => {
    console.log(`Listening on port 3000`);
});

