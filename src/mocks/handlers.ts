import { rest } from 'msw';

const handlers = [
  rest.get('/oauth-login/:authName', (req, res, ctx) => {
    const { authName } = req.params;
    let authUrl;
    switch (authName) {
      case 'google':
        authUrl = 'https://www.google.com';
        break;
      case 'naver':
        authUrl = 'https://www.naver.com';
        break;
      case 'kakao':
        authUrl = 'https://www.kakaocorp.com';
        break;
      default:
        authUrl = 'http://localhost:3000';
    }

    return res(ctx.json(authUrl));
  }),
];

export default handlers;
