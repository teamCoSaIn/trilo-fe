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
const planCardList = [
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
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDay: '23.03.25',
    endDay: '23.03.27',
  },
  {
    id: 2,
    title: '2023 부산 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/0304/b1fa/45b3c6de7187bb138e7099de0a1dfb3f?Expires=1682294400&Signature=kThV6-Fsjp1jdxtFz4H63msIV7qxx2Ptly3kPNTSIsmV6EGMbUDTUAKU7TkmsL5cw-dFkw9VVI1UFqO3AgzQ590Vzgy3oKTUB0mx7vO~is~fi334wDnFoHnZNK1l2nq77~DpiJ1wkStp-FpHfO9Y-2bWXhK5nSNoEVWiDqVUDfstouvzJnKmYuEMQNfv0i0k43xnZ-hu4vrvBLFDsa5AkygCANAjP3UUBPKmYZfDF-hSKcHkzk64RN~jffjeQtSHNd-8akS6Xy2uW3Ep5l4CEgjzoQwd6F-zlNeJbpPRt8KCMFFNyzTR1k~xoquN-lhJcG-s8V66pmbsD9G9EnzvlA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDay: '23.08.20',
    endDay: '23.08.22',
  },
  {
    id: 3,
    title: '23년 1월 괌 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDay: '23.03.25',
    endDay: '23.03.27',
  },
  {
    id: 4,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'ON',
    startDay: '23.08.20',
    endDay: '23.08.22',
  },
  {
    id: 5,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDay: '23.03.25',
    endDay: '23.03.27',
  },
];
const tripDays = [
  {
    dayId: 1,
    tripId: 1,
    date: '2023-02-15',
    color: '#FB6C6C',
    schedules: [
      {
        scheduleId: 235412,
        title: '캐널시티 하카타',
        placeName: '캐널시티 하카타',
        coordinate: {
          latitude: 21.31032591434633,
          longitude: -157.80890464782715,
        },
      },
      {
        scheduleId: 21423523,
        title: '쇼핑 리스트',
        placeName: '',
        coordinate: {
          latitude: 21.29985050848401,
          longitude: -157.81482696533203,
        },
      },
    ],
  },
  {
    dayId: 2,
    tripId: 1,
    date: '2023-02-16',
    color: '#5800FF',
    schedules: [
      {
        scheduleId: 5,
        title: '캐널시티 하카타',
        placeName: '캐널시티 하카타',
        coordinate: {
          latitude: 21.303432369155537,
          longitude: -157.84836605395122,
        },
      },
      {
        scheduleId: 6,
        title: '쇼핑 리스트',
        placeName: '',
        coordinate: {
          latitude: 21.29465251080877,
          longitude: -157.84246444702148,
        },
      },
      {
        scheduleId: 8,
        title: '관람차',
        placeName: '놀이공원',
        coordinate: {
          latitude: 21.292973118425635,
          longitude: -157.85164833068848,
        },
      },
    ],
  },
  {
    dayId: 3,
    tripId: 1,
    date: '2023-02-17',
    color: '#777',
    schedules: [
      {
        scheduleId: 21423456,
        title: '포케 먹기',
        placeName: '',
        coordinate: {
          latitude: 21.31,
          longitude: -157.8282696533203,
        },
      },
    ],
  },
  {
    dayId: 4,
    tripId: 1,
    date: null,
    color: '#C5FB6C',
    schedules: [],
  },
];
const planCardIds: { [index: string]: typeof tripDays } = {
  1: tripDays,
  2: [
    {
      dayId: 3,
      tripId: 1,
      date: null,
      color: '#ccc',
      schedules: [],
    },
  ],
};

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
      totalNumOfTripPlan: 10,
      badgeImgUrl:
        'https://user-images.githubusercontent.com/84956036/227441024-9853dda6-2100-466a-af20-b13d2e720f5f.png',
    })
  );
});

const getPlanCardDataList = rest.get(
  '/api/plancard-list',
  async (req, res, ctx) => {
    await sleep(2000);
    return res(ctx.json(planCardList));
  }
);

const changePlanCardTitle = rest.put(
  '/api/plancard-title',
  async (req, res, ctx) => {
    const { title, id } = await req.json();

    planCardList.forEach((el, idx, arr) => {
      if (el.id === id) {
        arr[idx].title = title;
      }
    });

    await sleep(2000);

    return res(ctx.status(200));
  }
);

const createPlanCard = rest.post('/api/plancard', async (req, res, ctx) => {
  const { title } = await req.json();
  await sleep(2000);

  const planCardData = {
    id: +new Date(),
    title,
    picUrl: '',
    status: '',
    startDay: '',
    endDay: '',
  };

  planCardList.unshift(planCardData);

  return res(ctx.status(200));
});

const deletePlanCard = rest.delete(
  '/api/plancard/:id',
  async (req, res, ctx) => {
    await sleep(2000);

    const { id } = req.params;

    const idx = planCardList.findIndex(el => el.id === +id);
    planCardList.splice(idx, 1);

    return res(ctx.status(200));
  }
);

const getPlanDayList = rest.get(
  '/api/trips/:planId/days',
  async (req, res, ctx) => {
    await sleep(2000);
    const { planId } = req.params;
    if (planId && planCardIds[planId as string]) {
      return res(ctx.json(planCardIds[planId as string]));
    }
    return res(ctx.status(400));
  }
);

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
  getPlanCardDataList,
  changePlanCardTitle,
  createPlanCard,
  deletePlanCard,
  getPlanDayList,
];

export default handlers;
