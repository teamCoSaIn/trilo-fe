import { rest } from 'msw';

type OauthServerKey = 'google' | 'kakao' | 'naver';

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

let error = false;
let isLogin = JSON.parse(localStorage.getItem('mockLogin') as string) || false;

const getLoginUrl = rest.get(
  '/api/auth/login/:oauthServer',
  async (req, res, ctx) => {
    if (error) {
      error = false;
      return res(
        ctx.status(403),
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
      await sleep(1000);
    } else if (oauthServer === 'naver') {
      await sleep(2000);
    } else if (oauthServer === 'kakao') {
      await sleep(3000);
    }

    return res(ctx.json(oauthServerObj[oauthServer as OauthServerKey]));
  }
);

const getAccessToken = rest.get(
  '/api/login/oauth2/code',
  async (req, res, ctx) => {
    const oauthCode = req.url.searchParams.get('code');
    const oauthState = req.url.searchParams.get('state');
    localStorage.setItem('mockLogin', 'true');
    isLogin = true;
    await sleep(2000);
    return res(
      ctx.json({
        token_type: `code:${oauthCode} state:${oauthState}`,
        expires_in: 86400,
        access_token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJleHAiOjI1NTE2MjMwMDB9.G',
        scope: 'photo offline_access',
        refresh_token: 'k9ysLtnRzntzxJWeBfTOdPXE',
      })
    );
  }
);

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
  return res(ctx.json({ response: isLogin }));
});

const getExpiredAccessToken = rest.get(
  '/api/expired-access-token',
  async (req, res, ctx) => {
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
  }
);

const logout = rest.get('/api/auth/logout', async (req, res, ctx) => {
  isLogin = false;
  localStorage.setItem('mockLogin', 'false');
  return res(ctx.json({}));
});

let nickname = 'oliver';
const getUserProfile = rest.get('/api/user-profile', async (req, res, ctx) => {
  // 쿠키에서 RT 확인 -> 유저 판별 -> 응답 전송
  return res(
    ctx.json({
      nickname,
      imgUrl: 'https://avatars.githubusercontent.com/u/84956036?s=40&v=4',
    })
  );
});

const changeNickname = rest.put('/api/user-nickname', async (req, res, ctx) => {
  const { nickname: newNickname } = await req.json();
  nickname = newNickname;
  await sleep(2000);

  return res(ctx.status(200));
});

const handlers = [
  getLoginUrl,
  getAccessToken,
  refreshAccessToken,
  getExpiredAccessToken,
  checkRefreshToken,
  logout,
  getUserProfile,
  changeNickname,
];
export default handlers;
