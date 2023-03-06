import { rest } from 'msw';

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

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

const getAccessToken = rest.get('/oauth-login', async (req, res, ctx) => {
  const oauthCode = req.url.searchParams.get('code');
  return res(
    ctx.json({
      token_type: `${oauthCode}`,
      expires_in: 86400,
      access_token:
        'AfRHlYzZT2ixtT7uZrj60d6zW5M2hplKhlfWv8ItMyMPrldoXSJ48p9azCLA7JGa8VdVGIPc',
      scope: 'photo offline_access',
      refresh_token: 'k9ysLtnRzntzxJWeBfTOdPXE',
    })
  );
});

const handlers = [getLoginUrl, getAccessToken];
export default handlers;
