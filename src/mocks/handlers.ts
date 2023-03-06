import { rest } from 'msw';

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

const getLoginUrlByAuthName = rest.get(
  '/oauth-login/:authName',
  async (req, res, ctx) => {
    const { authName } = req.params;
    let authUrl;
    switch (authName) {
      case 'google':
        await sleep(3000);
        authUrl = 'https://www.google.com';
        break;
      case 'naver':
        await sleep(1000);
        authUrl = 'https://www.naver.com';
        return res(
          // Send a valid HTTP status code
          ctx.status(403),
          // And a response body, if necessary
          ctx.json({
            errorMessage: `url not found`,
          })
        );
        break;
      case 'kakao':
        authUrl = 'https://www.kakaocorp.com';
        break;
      default:
        authUrl = 'http://localhost:3000';
    }

    return res(ctx.json(authUrl));
  }
);
let error = true;
const getLoginUrl = rest.get('/oauth-loginUrl', async (req, res, ctx) => {
  await sleep(1000);
  if (error) {
    error = false;
    return res(
      // Send a valid HTTP status code
      ctx.status(403),
      // And a response body, if necessary
      ctx.json({
        errorMessage: `url not found`,
      })
    );
  }
  const authTable = {
    kakao: 'https://www.kakaocorp.com',
    google: 'https://www.google.com',
    naver: 'https://www.naver.com',
  };
  return res(ctx.json(authTable));
});

const handlers = [getLoginUrl];
export default handlers;
