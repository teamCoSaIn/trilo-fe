import { rest } from 'msw';

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

let error = true;
const getLoginUrl = rest.get('/api/oauth-loginUrl', async (req, res, ctx) => {
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

  const authArr = [
    { name: 'google', url: 'https://www.google.com', id: 1 },
    { name: 'naver', url: 'https://www.kakaocorp.com', id: 2 },
    { name: 'kakao', url: 'https://www.naver.com', id: 3 },
  ];

  return res(ctx.json(authArr));
});

const getAccessToken = rest.get('/api/oauth-login', async (req, res, ctx) => {
  const oauthCode = req.url.searchParams.get('code');
  await sleep(1000);
  return res(
    ctx.json({
      token_type: `${oauthCode}`,
      expires_in: 86400,
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjoxNTE2MjM5MDIyfQ.E9bQ6QAil4HpH825QC5PtjNGEDQTtMpcj0SO2W8vmag',
      scope: 'photo offline_access',
      refresh_token: 'k9ysLtnRzntzxJWeBfTOdPXE',
    })
  );
});

const handlers = [getLoginUrl, getAccessToken];
export default handlers;
