// const { Configuration, OpenAIApi } = require("openai");
// const configuration = new Configuration({
//  apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

const OpenAIApi = require("openai");

const openai = new OpenAIApi(process.env.OPENAI_API_KEY);


const users = {};
const instruction = `You are an impersonator. Your job is to impersonate the given famous individual below.
Ensure you introduce and tell a bit about yourself at the start of the conversation so the user knows exactly who you are. You will also have the personality and knowledge of the given individual. Avoid long responses.

Famous Individual: `

module.exports = async function generatePersonalityResponse(message, number) {
  // Grab user from "database"
  const user = users[number];
  // Check whether user included a personality to impersonate
  const personalityIncluded = message.toLowerCase().startsWith('impersonate ');

  // If no user is found and they did not include personality, send default message
  if(!user && !personalityIncluded) return 'Text \'Impersonate\' followed by the individual you\'d like me to impersonate';
  // If user included personality, reset/add personality and messages to user
  if(personalityIncluded) {
      const personality = message.toLowerCase().split('impersonate ')[1].trim();
      const systemMessage = {role: 'system', content: instruction + personality}
      const starterMessage = {role: 'user', content: 'hey'}
      users[number] = {personality: personality, messages: [systemMessage, starterMessage]}
  }
  // construct message object for messages array
  else {
      const messageObj = {role: 'user', content: message}
      users[number].messages.push(messageObj);
  }
  // Generate AI message, store in users messages and return to user
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: users[number].messages,
      max_tokens: 100
    });
  const aiResponse = completion.choices[0].message.content
  users[number].messages.push({role: 'assistant', content: aiResponse})
  return aiResponse
}
