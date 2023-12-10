import axios from "axios";
import { OpenAI } from "openai";

import loks from '@/components/Gameplay/loks.json'

const configuration = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
};

const openai = new OpenAI(configuration);

let storyPlot = ''

const getOptionsRecord = (sp: string) => `Create 3 options for this scenario in the format suggested later.
${sp}

Avoid using words option a, option b, option c in the response, just mention the option statment itself.

Always give response in the json format:
{ 
    "options": ["option a", "option b", "option c"],
}
`


const systemRecord = () => `you are an excellent story teller, and the user is the main character of story. Give a name to the user who is the main character. write the story in that figure of speech, considering the following initial plot:

${storyPlot}

Drive the story and continuously ask the user for input after every plot turn to take an action that can lead to dramatic turns in the story based on the next step the user may take.

Make sure to:
- give names to characters
- sometimes create suprising or unexpected happenings in the world use jokes, expressions, sarcasm
- go in details like telling numbers where needed
- avoid accepting users request to escaping the physical realities

Always give response in the json format:
{ 
    "title": "a related title of the story",
    "options": ["option a", "option b", "option c"],
    "message": "the story data that you generated based on user actions, should be under 100 words. Use "<br/>" tag where you want new line. Avoid using double quotes.",
}
`

export const generateSummary = async (messages: any[]) => {
  const chat_completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [{
      'role': 'system',
      'content': systemRecord()
    }, ...(messages as any)],
    temperature: 0.4,
    max_tokens: 300
  });

  console.log('c', chat_completion)
  const chat = chat_completion.choices[0]
  try {
    const d = chat.message?.content;
    return d;
  } catch (e) {
    console.log(e)
  }
}

export const startNewStory = async (sp: string) => {
  storyPlot = sp
  const messages = [{
    'role': 'system',
    'content': systemRecord()
  }]

  const chat_completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: messages as any,
    temperature: 1,
    max_tokens: 250,
    response_format: { type: "json_object" },
  });

  console.log(chat_completion)
  const chat = chat_completion.choices[0]

  try {
    const d = JSON.parse(chat.message?.content ?? '{}');
    return d;
  } catch (e) {
    console.log(e)
  }
}


export const getNewOptions = async (sp: string) => {
  const messages = [{
    'role': 'system',
    'content': getOptionsRecord(sp)
  }]

  const chat_completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: messages as any,
    temperature: 1,
    max_tokens: 250,
    response_format: { type: "json_object" },
  });

  console.log(chat_completion)
  const chat = chat_completion.choices[0]

  try {
    const d = JSON.parse(chat.message?.content ?? '{}');
    return d;
  } catch (e) {
    console.log(e)
  }
}


export const continueStory = async (messages: any) => {
  const chat_completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [{
      'role': 'system',
      'content': systemRecord()
    }, ...(messages as any)],
    temperature: 0.4,
    max_tokens: 300
  });

  console.log('c', chat_completion)
  const chat = chat_completion.choices[0]
  try {
    const d = JSON.parse(chat.message?.content ?? '{}');
    return d;
  } catch (e) {
    console.log(e)
  }
}

export const createImagePrompt = async (messages: any) => {
  const chat_completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-1106",
    messages: [{
      role: "system", content: `
      Continue the following conversation, as your duty is to curate the story as the user take actions and make it more fun, exciting, surprising with few mysteries, riddles / puzzels and levels.
    `}, ...(messages as any)],
    temperature: 1,
    max_tokens: 256,
    top_p: 1
  });

  console.log('c', chat_completion)
  const chat = chat_completion.choices[0]
  return chat.message?.content;
}

export const textToImage = async (prompt: string, lok: typeof loks.loks[0]) => {
  const path =
    "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_STABILITY}`
  };

  const body = {
    steps: 40,
    width: 1024,
    height: 1024,
    seed: 0,
    cfg_scale: 5,
    samples: 1,
    style_preset: "anime",
    text_prompts: [
      {
        "text": prompt,
        "weight": 1
      },
      {
        "text": "blurry, bad, black and white",
        "weight": -1
      }
    ],
  };

  const options = {
    url: path,
    method: "POST",
    headers,
    data: body
  }

  const response = await axios(options)

  if (response.status != 200) {
    throw new Error(`Non-200 response: ${await response}`)
  }

  const responseJSON = await response.data;

  console.log(responseJSON)
  return responseJSON.artifacts[0].base64
};

export const createImage = async (prompt: string) => {
  const response = await openai.images.generate({
    prompt,
    n: 1,
    size: "512x512",
  })
  console.log(response.data[0])


  return response.data[0].url
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