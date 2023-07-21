import axios from 'axios';

export const requestChat = async (text: string) => {
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
        { role: 'user', content: text },
      ],
    },
  });
  return res.data;
};
