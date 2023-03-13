import { rest } from 'msw';

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

let error = true;

type OauthServerKey = 'google' | 'kakao' | 'naver';

const getLoginUrl = rest.get(
  '/api/oauth-loginUrl/:oauthServer',
  async (req, res, ctx) => {
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

    const { oauthServer } = req.params;

    const oauthServerObj = {
      google:
        'https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&client_id=617586228502-jt90dtphens9q13kekbgjbm1pljptju6.apps.googleusercontent.com&scope=profile email&state=B59MKaVW5uj5g7u49_6Prv0TYwgManDktWldh23NJXo=&redirect_uri=http://localhost:3000/oauth2/callback&service=lso&o2v=2&flowName=GeneralOAuthFlow',
      naver: 'https://www.naver.com',
      kakao: 'https://www.kakaocorp.com',
    };

    if (oauthServer === 'google') {
      await sleep(3000);
    } else if (oauthServer === 'naver') {
      await sleep(1000);
    }

    return res(ctx.json(oauthServerObj[oauthServer as OauthServerKey]));
  }
);

const getAccessToken = rest.get('/api/oauth-login', async (req, res, ctx) => {
  const oauthCode = req.url.searchParams.get('code');
  await sleep(2000);
  return res(
    ctx.json({
      token_type: `${oauthCode}`,
      expires_in: 86400,
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJleHAiOjI1NTE2MjMwMDB9.G',
      scope: 'photo offline_access',
      refresh_token: 'k9ysLtnRzntzxJWeBfTOdPXE',
    })
  );
});

const refreshAccessToken = rest.get(
  '/api/auth/regeneration',
  async (req, res, ctx) => {
    await sleep(1000);
    return res(
      ctx.json({
        token_type: 'Bearer Token',
        expires_in: 86400,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJleHAiOjI1NTE2MjMwMDB9.G',
        scope: 'photo offline_access',
        refresh_token: 'k9ysLtnRzntzxJWeBfTOdPXE',
      })
    );
  }
);

const checkRefreshToken = rest.get('/api/auth/check', async (req, res, ctx) => {
  await sleep(1000);
  // return res(
  //   ctx.json({
  //     response: false,
  //   })
  // );
  return res(ctx.json({ response: true }));
});

// 만료 token 요청 api
const test = rest.get('/api/test', async (req, res, ctx) => {
  await sleep(2000);
  return res(
    ctx.json({
      token_type: 'Bearer Token',
      expires_in: 86400,
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJleHAiOjE1MTYyMzAwMH0.Q',
      scope: 'photo offline_access',
      refresh_token: 'k9ysLtnRzntzxJWeBfTOdPXE',
    })
  );
});

const test2 = rest.get('/api/test2', async (req, res, ctx) => {
  // await sleep(2000);
  return res(ctx.json({}));
});

const logout = rest.get('/api/auth/logout', async (req, res, ctx) => {
  // await sleep(2000);
  // cookie에서 refresh token 삭제
  return res(ctx.json({}));
});

const handlers = [
  getLoginUrl,
  getAccessToken,
  refreshAccessToken,
  test,
  test2,
  logout,
  checkRefreshToken,
];
export default handlers;
