import axios from 'axios';

export type TRole = 'user' | 'assistant';

export interface IChat {
  role: TRole;
  content: string;
}

export const requestChat = async (chatHistory: IChat[]) => {
  const res = await axios({
    method: 'post',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      Authorization: `Bearer ${process.env.OPEN_AI_API_KEY}`,
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '너는 20대 여행사 직원이야.' },
        ...chatHistory,
      ],
    },
  });
  return res.data;
};
