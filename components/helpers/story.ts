import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const systemRecord = `You are an excellent story teller, place the user as the main character of story and write in that context. Consider the following initial plot:

The player starts the world in which magic is allowed, and the player was 13 years old when he was kidnapped by an elf and admitted to one of the very famous magic school which was not known by non-believers. 

This is a fun, happening yet thriller story sharing values like friendship, trust, imagination, secrets and secret villains.

Drive the story into continuously by asking the user / player input after every plot  to take an action about what's next step the player want to take and give some suggestions.

Make sure to:
- always confine the users into the scope of the story
- avoid accepting users request to going out of the story bounds and escaping the physical realities

Response in the following json format:
{ 
    "title": "the title of the story, think of very innovative one",
    "summary": "a very short summary under 200 words about the story plot",
    "message": "the story data that you generated based on user actions, should be around 400 words. Use <br /> tag where you want new line. Avoid using double quotes.",
    "options": ["do a", "do b", "do c"]
}
`

export const startNewStory = async () => {

  const messages = [{
    'role': 'system',
    'content': systemRecord
  }]

  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: messages as any,
    temperature: 1
  });

  console.log(chat_completion)
  const chat = chat_completion.data.choices[0]

  try {
    const d = JSON.parse(chat.message?.content ?? '{}');
    return d;
  } catch (e) {
    console.log(e)
  }
}


export const continueStory = async (messages: any) => {
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system", content: `
      Continue the following conversation, as your duty is to curate the story as the user take actions and make it more fun, exciting, surprising with few mysteries, riddles / puzzels and levels.
    `}, ...(messages as any)],
    temperature: 1,
    max_tokens: 256,
    top_p: 1
  });

  console.log('c', chat_completion)
  const chat = chat_completion.data.choices[0]
  return chat.message?.content;
}

export const createImagePrompt = async (messages: any) => {
  const chat_completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{
      role: "system", content: `
      Continue the following conversation, as your duty is to curate the story as the user take actions and make it more fun, exciting, surprising with few mysteries, riddles / puzzels and levels.
    `}, ...(messages as any)],
    temperature: 1,
    max_tokens: 256,
    top_p: 1
  });

  console.log('c', chat_completion)
  const chat = chat_completion.data.choices[0]
  return chat.message?.content;
}

export const createImage = async (prompt: string) => {
  const response = await openai.createImage({
    prompt,
    n: 1,
    size: "512x512",
  })
  console.log(response.data.data[0])
  return response.data.data[0].url
}

export async function getImageData(url: string) {
  try {
    const response = await axios.post('/api/getImage', {
      url: url
    });
    console.log('response', response.data)
    console.log(response.data);
    return response.data
  } catch (error) {
    console.error('Error fetching file:', error);
  }
}