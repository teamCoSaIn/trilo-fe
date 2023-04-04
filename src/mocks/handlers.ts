import { rest } from 'msw';

type OauthServerKey = 'google' | 'kakao' | 'naver';

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

let error = false;
let isLogin = JSON.parse(localStorage.getItem('mockLogin') as string) || false;
let nickname = 'oliver';
const tripList = [
  {
    id: 0,
    title: '2023 다낭계획',
    picUrl: '',
    status: '',
    startDay: '',
    endDay: '',
  },
  {
    id: 1,
    title: '2023 제주 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/644a/d81e/0c050de4ad0e11b23c482035a398dbb8?Expires=1681084800&Signature=LlPAb4a49H2P-E5n1sPfZCM~QLsD7CFLARDBzpFpckFnysDtV~4hv8xTJoTUos8KRMJQPctTi91~80GSvfJXGgiMZZv5TEVcXYVp0FTUH26~fHq88~NsZ7sVbpUgog5JXhgr4B-qqFrr7EXoijIP9qBV1DkNxCNuMxtm9~-OMe1XUa2-8DEL4ytEQ6eNfTgNIHZ6NDs5cCy31jnibVBKmAB5quZTuHtB88QhbyBP7WBzu52wN4BMO5n58dXaULVHT~TWH5WexLSR0OyKfgtXsmJ1tdbQSN~we9IFg2n-9a~IdpTLHnvhh7DMyfpMJC5okiBbIgmUCj339tys9QsSXQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDay: '23.03.25',
    endDay: '23.03.27',
  },
  {
    id: 2,
    title: '2023 부산 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/3327/e6a1/5bcb290a01f335bc8da914c5c122d36b?Expires=1681084800&Signature=gVDVxEhPgeboEejFZCLW~VZh~j2GKc6UmEsg2-D0Nd-00HDHxjwjApBrL4~XWmhRLwGzbHpb1IQ7L5tuJbnDHWp53r1j5EY2rFlyeq2~c~JVVjRVrokIpV64mXFC7YFxlTHaSUBqKz6bQSTbouWlVbLnamgcDeuXbh9AvFVUQPczIdQb554WMHtJKLVy3WT5T951W6UtoUh1g4uVT2WqDtpgupfQK9Kn5hcsfDgMnKrgu~GlV3meu8q3mZrnBU2yMj2kECNS-2KskWNsIS3h5eC-mRhqnfKaH-Ok71kZe8FmRL~c7JTGxFqGuE1UX-2DhbHd1zsAQeXnAnvs-e7nTA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDay: '23.08.20',
    endDay: '23.08.22',
  },
  {
    id: 3,
    title: '23년 1월 괌 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/644a/d81e/0c050de4ad0e11b23c482035a398dbb8?Expires=1681084800&Signature=LlPAb4a49H2P-E5n1sPfZCM~QLsD7CFLARDBzpFpckFnysDtV~4hv8xTJoTUos8KRMJQPctTi91~80GSvfJXGgiMZZv5TEVcXYVp0FTUH26~fHq88~NsZ7sVbpUgog5JXhgr4B-qqFrr7EXoijIP9qBV1DkNxCNuMxtm9~-OMe1XUa2-8DEL4ytEQ6eNfTgNIHZ6NDs5cCy31jnibVBKmAB5quZTuHtB88QhbyBP7WBzu52wN4BMO5n58dXaULVHT~TWH5WexLSR0OyKfgtXsmJ1tdbQSN~we9IFg2n-9a~IdpTLHnvhh7DMyfpMJC5okiBbIgmUCj339tys9QsSXQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDay: '23.03.25',
    endDay: '23.03.27',
  },
  {
    id: 4,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/3327/e6a1/5bcb290a01f335bc8da914c5c122d36b?Expires=1681084800&Signature=gVDVxEhPgeboEejFZCLW~VZh~j2GKc6UmEsg2-D0Nd-00HDHxjwjApBrL4~XWmhRLwGzbHpb1IQ7L5tuJbnDHWp53r1j5EY2rFlyeq2~c~JVVjRVrokIpV64mXFC7YFxlTHaSUBqKz6bQSTbouWlVbLnamgcDeuXbh9AvFVUQPczIdQb554WMHtJKLVy3WT5T951W6UtoUh1g4uVT2WqDtpgupfQK9Kn5hcsfDgMnKrgu~GlV3meu8q3mZrnBU2yMj2kECNS-2KskWNsIS3h5eC-mRhqnfKaH-Ok71kZe8FmRL~c7JTGxFqGuE1UX-2DhbHd1zsAQeXnAnvs-e7nTA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'ON',
    startDay: '23.08.20',
    endDay: '23.08.22',
  },
  {
    id: 5,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/644a/d81e/0c050de4ad0e11b23c482035a398dbb8?Expires=1681084800&Signature=LlPAb4a49H2P-E5n1sPfZCM~QLsD7CFLARDBzpFpckFnysDtV~4hv8xTJoTUos8KRMJQPctTi91~80GSvfJXGgiMZZv5TEVcXYVp0FTUH26~fHq88~NsZ7sVbpUgog5JXhgr4B-qqFrr7EXoijIP9qBV1DkNxCNuMxtm9~-OMe1XUa2-8DEL4ytEQ6eNfTgNIHZ6NDs5cCy31jnibVBKmAB5quZTuHtB88QhbyBP7WBzu52wN4BMO5n58dXaULVHT~TWH5WexLSR0OyKfgtXsmJ1tdbQSN~we9IFg2n-9a~IdpTLHnvhh7DMyfpMJC5okiBbIgmUCj339tys9QsSXQ__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDay: '23.03.25',
    endDay: '23.03.27',
  },
];

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

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

const getUserInfo = rest.get('/api/user-info', async (req, res, ctx) => {
  return res(
    ctx.json({
      totalDistanceOfPastTrip: 410,
      totalNumOfTrip: 10,
      badgeImgUrl:
        'https://user-images.githubusercontent.com/84956036/227441024-9853dda6-2100-466a-af20-b13d2e720f5f.png',
    })
  );
});

const getTripList = rest.get('/api/trip-list', async (req, res, ctx) => {
  await sleep(2000);
  return res(ctx.json(tripList));
});

const changeTripCardTitle = rest.put(
  '/api/tripcard-title',
  async (req, res, ctx) => {
    const { title, id } = await req.json();

    tripList.forEach((el, idx, arr) => {
      if (el.id === id) {
        arr[idx].title = title;
      }
    });

    await sleep(2000);

    return res(ctx.status(200));
  }
);

const createTripCard = rest.post('/api/tripcard', async (req, res, ctx) => {
  const { title } = await req.json();
  await sleep(2000);

  const tripCardData = {
    id: +new Date(),
    title,
    picUrl: '',
    status: '',
    startDay: '',
    endDay: '',
  };

  tripList.unshift(tripCardData);

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
  getUserInfo,
  getTripList,
  changeTripCardTitle,
  createTripCard,
];

export default handlers;
