import { rest } from 'msw';

import { IDailyPlan } from '@/api/plan';

interface IScheduleResponse {
  scheduleId: number;
  title: string;
  placeId: string;
  placeName: string;
  coordinate: ICoordinate;
}

interface ICoordinate {
  latitude: number;
  longitude: number;
}

const sleep = (ms: number) =>
  new Promise(r => {
    setTimeout(r, ms);
  });

/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ DB ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

let isLogin = JSON.parse(localStorage.getItem('mockLogin') as string) || false;
let nickname = 'oliver';
const tripList = [
  {
    tripId: 0,
    title: '2023 다낭계획',
    picUrl: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  {
    tripId: 1,
    title: '2023 제주 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-03-25',
    endDate: '2023-03-27',
  },
  {
    tripId: 2,
    title: '2023 부산 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/0304/b1fa/45b3c6de7187bb138e7099de0a1dfb3f?Expires=1682294400&Signature=kThV6-Fsjp1jdxtFz4H63msIV7qxx2Ptly3kPNTSIsmV6EGMbUDTUAKU7TkmsL5cw-dFkw9VVI1UFqO3AgzQ590Vzgy3oKTUB0mx7vO~is~fi334wDnFoHnZNK1l2nq77~DpiJ1wkStp-FpHfO9Y-2bWXhK5nSNoEVWiDqVUDfstouvzJnKmYuEMQNfv0i0k43xnZ-hu4vrvBLFDsa5AkygCANAjP3UUBPKmYZfDF-hSKcHkzk64RN~jffjeQtSHNd-8akS6Xy2uW3Ep5l4CEgjzoQwd6F-zlNeJbpPRt8KCMFFNyzTR1k~xoquN-lhJcG-s8V66pmbsD9G9EnzvlA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 3,
    title: '23년 1월 괌 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-03-25',
    endDate: '2023-03-27',
  },
  {
    tripId: 4,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'ON',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 5,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-03-25',
    endDate: '2023-03-27',
  },
  {
    tripId: 6,
    title: '2023 다낭계획',
    picUrl: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  {
    tripId: 7,
    title: '2023 제주 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-03-25',
    endDate: '2023-03-27',
  },
  {
    tripId: 8,
    title: '2023 부산 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/0304/b1fa/45b3c6de7187bb138e7099de0a1dfb3f?Expires=1682294400&Signature=kThV6-Fsjp1jdxtFz4H63msIV7qxx2Ptly3kPNTSIsmV6EGMbUDTUAKU7TkmsL5cw-dFkw9VVI1UFqO3AgzQ590Vzgy3oKTUB0mx7vO~is~fi334wDnFoHnZNK1l2nq77~DpiJ1wkStp-FpHfO9Y-2bWXhK5nSNoEVWiDqVUDfstouvzJnKmYuEMQNfv0i0k43xnZ-hu4vrvBLFDsa5AkygCANAjP3UUBPKmYZfDF-hSKcHkzk64RN~jffjeQtSHNd-8akS6Xy2uW3Ep5l4CEgjzoQwd6F-zlNeJbpPRt8KCMFFNyzTR1k~xoquN-lhJcG-s8V66pmbsD9G9EnzvlA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 9,
    title: '23년 1월 괌 여행',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-07-25',
    endDate: '2023-07-27',
  },
  {
    tripId: 10,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'ON',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 11,
    title: '2023 다낭계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023.09.25',
    endDate: '2023.09.27',
  },
  {
    tripId: 12,
    title: '2023 오키나와계획',
    picUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023.09.25',
    endDate: '2023.09.27',
  },
];

const tripDays: IDailyPlan[] = [
  {
    dayId: 1,
    tripId: 1,
    date: '2023-02-15',
    color: {
      name: 'red',
      code: '#FB6C6C',
    },
    schedules: [
      {
        scheduleId: 235410,
        title: '캐널시티 하카타',
        placeId: 'ChIJYcOBiZWRQTUR0Rl0ehe67eA',
        placeName: '캐널시티 하카타',
        coordinate: {
          latitude: 21.31032591434633,
          longitude: -157.80890464782715,
        },
      },
      {
        scheduleId: 235411,
        title: '쇼핑 리스트',
        placeId: '',
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
    color: {
      name: 'blue',
      code: '#4D77FF',
    },
    schedules: [
      {
        scheduleId: 235412,
        title: '동방명주',
        placeId: 'ChIJYcOBiZWRQTUR0Rl0ehe67eA',
        placeName: '캐널시티 하카타',
        coordinate: {
          latitude: 21.303432369155537,
          longitude: -157.84836605395122,
        },
      },
      {
        scheduleId: 235413,
        title: '하노이',
        placeId: '',
        placeName: '',
        coordinate: {
          latitude: 21.29465251080877,
          longitude: -157.84246444702148,
        },
      },
      {
        scheduleId: 235414,
        title: '관람차',
        placeId: 'ChIJH4KfOtiTQTURBa18FQ38vaI',
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
    color: {
      name: 'green',
      code: '#43D65A',
    },
    schedules: [
      {
        scheduleId: 235415,
        title: '포케 먹기',
        placeId: 'ChIJrynB5fRtAHwReIhoKsXdM0Y',
        placeName: '와이키키',
        coordinate: {
          latitude: 21.31,
          longitude: -157.8282696533203,
        },
      },
    ],
  },
];

const tempPlan = [
  {
    scheduleId: 335410,
    title: '1',
    placeId: 'ChIJYcOBiZWRQTUR0Rl0ehe67eA',
    placeName: '캐널시티 하카타',
    coordinate: {
      latitude: 21.34032591434633,
      longitude: -157.80890464782715,
    },
  },
  {
    scheduleId: 335411,
    title: '2',
    placeId: 'ChIJUf6gTvttAHwRi4AmgKEUacM',
    placeName: '콜로왈루 공원',
    coordinate: {
      latitude: 21.24985050848401,
      longitude: -157.8248269653323,
    },
  },
  {
    scheduleId: 335412,
    title: '3',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: '카마넬 공원',
    coordinate: {
      latitude: 21.44985050848401,
      longitude: -157.7248269653323,
    },
  },
  {
    scheduleId: 335413,
    title: '4',
    placeId: 'ChIJYcOBiZWRQTUR0Rl0ehe67eA',
    placeName: '하카타',
    coordinate: {
      latitude: 21.35,
      longitude: -157.80890464782715,
    },
  },
  {
    scheduleId: 335414,
    title: '5',
    placeId: 'ChIJUf6gTvttAHwRi4AmgKEUacM',
    placeName: '콜로왈공원',
    coordinate: {
      latitude: 21.26,
      longitude: -157.8248269653323,
    },
  },
  {
    scheduleId: 335415,
    title: '6',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: '카마공원',
    coordinate: {
      latitude: 21.46,
      longitude: -157.7248269653323,
    },
  },
  {
    scheduleId: 335416,
    title: '7',
    placeId: 'ChIJYcOBiZWRQTUR0Rl0ehe67eA',
    placeName: '하카타',
    coordinate: {
      latitude: 21.37,
      longitude: -157.80890464782715,
    },
  },
  {
    scheduleId: 335417,
    title: '8',
    placeId: 'ChIJUf6gTvttAHwRi4AmgKEUacM',
    placeName: '콜공원',
    coordinate: {
      latitude: 21.28,
      longitude: -157.8248269653323,
    },
  },
  {
    scheduleId: 335418,
    title: '9',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: '카공원',
    coordinate: {
      latitude: 21.48,
      longitude: -157.7248269653323,
    },
  },
  {
    scheduleId: 335419,
    title: '10',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: '카공원123',
    coordinate: {
      latitude: 21.49,
      longitude: -157.7348269653323,
    },
  },
  {
    scheduleId: 335420,
    title: '11',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: '카공원',
    coordinate: {
      latitude: 21.5,
      longitude: -157.7148269653323,
    },
  },
  {
    scheduleId: 335421,
    title: '12',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: '올공원',
    coordinate: {
      latitude: 21.528,
      longitude: -157.545,
    },
  },
  {
    scheduleId: 335422,
    title: '13',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'abc',
    coordinate: {
      latitude: 21.538,
      longitude: -157.525,
    },
  },
  {
    scheduleId: 335423,
    title: '14',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335424,
    title: '15',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335425,
    title: '16',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335426,
    title: '17',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335427,
    title: '18',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335428,
    title: '19',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335429,
    title: '20',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335430,
    title: '21',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
  {
    scheduleId: 335431,
    title: '22',
    placeId: 'ChIJG4al8aJtAHwRIJk2N8_beUI',
    placeName: 'def',
    coordinate: {
      latitude: 21.529,
      longitude: -157.245,
    },
  },
];

const tripCardIds: { [index: string]: typeof tripDays } = {
  1: tripDays,
  2: [
    {
      dayId: 3,
      tripId: 1,
      date: '2023-05-18',
      color: {
        name: 'red',
        code: '#ccc',
      },
      schedules: [],
    },
  ],
};

const scheduleDetails = {
  scheduleId: 235415,
  dayId: 3,
  title: '포케 먹기',
  placeName: '와이키키',
  coordinate: {
    latitude: 21.31,
    longitude: -157.8282696533203,
  },
  content:
    '[{"id":"bc60208b-7261-4a43-ae11-49de53c42d7d","type":"heading","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left","level":"1"},"content":[{"type":"text","text":"아침 일정","styles":{}}],"children":[]},{"id":"a258bbe7-8498-42b0-a358-d481ade18e6b","type":"bulletListItem","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"우버 타고 이동하기","styles":{}}],"children":[]},{"id":"184aaa20-e85f-4e7d-8881-bb1fb80f592f","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]},{"id":"456c7030-c4cb-4fb4-b29b-efb6bdc23a59","type":"bulletListItem","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[{"type":"text","text":"브런치 카페에서 아침 먹기","styles":{}}],"children":[]},{"id":"c7202d6d-69a7-4c2c-8352-f894e40b69d7","type":"paragraph","props":{"textColor":"default","backgroundColor":"default","textAlignment":"left"},"content":[],"children":[]}]',
  startTime: '10:00',
  endTime: '12:30',
};
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

const getAccessToken = rest.post(
  '/api/auth/login/:oauthServer',
  async (req, res, ctx) => {
    const oauthCode = req.url.searchParams.get('code');
    localStorage.setItem('mockLogin', 'true');
    isLogin = true;
    await sleep(1000);
    return res(
      ctx.json({
        authType: `code:${oauthCode}`,
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJleHAiOjI1NTE2MjMwMDB9.G',
        userId: 0,
      })
    );
  }
);

const refreshAccessToken = rest.post(
  '/api/auth/reissue',
  async (req, res, ctx) => {
    await sleep(1000);
    return res(
      ctx.json({
        authType: `Bearer`,
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJleHAiOjI1NTE2MjMwMDB9.G',
        userId: 0,
      })
    );
  }
);

const checkRefreshToken = rest.get(
  '/api/auth/token/refresh-token-info',
  async (req, res, ctx) => {
    await sleep(1000);
    return res(ctx.json({ availability: isLogin }));
  }
);

const getExpiredAccessToken = rest.get(
  '/api/expired-access-token',
  async (req, res, ctx) => {
    await sleep(1000);
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

const logout = rest.post('/api/auth/logout', async (req, res, ctx) => {
  isLogin = false;
  localStorage.setItem('mockLogin', 'false');
  return res(ctx.status(200));
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
  await sleep(1000);

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

const getTripList = rest.get('/api/trips', async (req, res, ctx) => {
  await sleep(1000);
  let response;
  const pointerId = req.url.searchParams.get('tripId');
  const size = Number(req.url.searchParams.get('size') || '0');
  if (!pointerId) {
    response = {
      trips: tripList.slice(0, size),
      hasNext: tripList.length > size,
    };
  } else {
    const pointerIdx = tripList.findIndex(it => it.tripId === +pointerId);
    const curTripList = tripList.slice(pointerIdx + 1, pointerIdx + 1 + size);
    response = {
      trips: curTripList,
      hasNext: pointerIdx + 1 + size < tripList.length,
    };
  }

  return res(ctx.json(response));
});

const changeTripTitle = rest.put(
  '/api/trips/:tripId/title',
  async (req, res, ctx) => {
    const { title, tripId } = await req.json();

    tripList.forEach((el, idx, arr) => {
      if (el.tripId === tripId) {
        arr[idx].title = title;
      }
    });

    await sleep(1000);

    return res(ctx.status(200));
  }
);

const changeTripImg = rest.post(
  '/api/trips/:tripId/image/update',
  async (req, res, ctx) => {
    await sleep(1000);
    return res(ctx.status(200));
  }
);

const changeTripPeriod = rest.put(
  '/api/trips/:tripId/period',
  async (req, res, ctx) => {
    const { startDate, endDate, tripId } = await req.json();

    tripList.forEach((el, idx, arr) => {
      if (el.tripId === tripId) {
        arr[idx].startDate = startDate;
        arr[idx].endDate = endDate;
      }
    });

    await sleep(1000);

    return res(ctx.status(200));
  }
);

const createTrip = rest.post('/api/trips', async (req, res, ctx) => {
  const { title } = await req.json();
  await sleep(1000);

  const trip = {
    tripId: +new Date(),
    title,
    picUrl: '',
    status: '',
    startDate: '',
    endDate: '',
  };

  tripList.unshift(trip);

  return res(ctx.status(200));
});

const deleteTrip = rest.delete('/api/trips/:tripId', async (req, res, ctx) => {
  await sleep(1000);

  const { tripId } = req.params;

  const idx = tripList.findIndex(el => el.tripId === +tripId);
  tripList.splice(idx, 1);

  return res(ctx.status(204));
});

const getDailyPlanList = rest.get(
  '/api/trips/:tripId/days',
  async (req, res, ctx) => {
    await sleep(1000);
    const { tripId } = req.params;
    if (tripId && tripCardIds[tripId as string]) {
      return res(ctx.json(tripCardIds[tripId as string]));
    }
    return res(ctx.status(400));
  }
);

const createSchedule = rest.post('/api/schedules', async (req, res, ctx) => {
  const data = await req.json();

  const newSchedule: IScheduleResponse = {
    scheduleId: Date.now(),
    ...data,
  };

  if (data.dayId) {
    tripDays.forEach((tripDay, idx, arr) => {
      if (tripDay.dayId === data.dayId) {
        arr[idx].schedules.unshift(newSchedule);
      }
    });
  } else {
    tempPlan.unshift(newSchedule);
  }

  return res(ctx.status(200));
});

const changeScheduleOrder = rest.patch(
  '/api/schedules/:scheduleId',
  async (req, res, ctx) => {
    // do something
    // const { scheduleId } = req.params;
    tripDays[0].schedules.length = 1;
    return res(ctx.status(200));
  }
);

const deleteSchedule = rest.delete(
  '/api/schedules/:scheduleId',
  async (req, res, ctx) => {
    await sleep(1000);

    const { scheduleId } = req.params;
    const curTrip = tripCardIds['1'];
    curTrip.forEach(day => {
      const idx = day.schedules.findIndex(
        sch => sch.scheduleId === +scheduleId
      );
      if (idx !== -1) {
        day.schedules.splice(idx, 1);
      }
    });

    for (let i = 0; i < tempPlan.length; i += 1) {
      if (tempPlan[i].scheduleId === +scheduleId) {
        tempPlan.splice(i, 1);
        break;
      }
    }
    return res(ctx.status(200));
  }
);

const getScheduleDetails = rest.get(
  '/api/schedules/:scheduleId',
  async (req, res, ctx) => {
    await sleep(1000);
    const { scheduleId } = req.params;
    if (scheduleId) {
      return res(ctx.json(scheduleDetails));
    }
    return res(ctx.status(400));
  }
);

const changeScheduleDetails = rest.put(
  '/api/schedules/:scheduleId',
  async (req, res, ctx) => {
    await sleep(1000);
    const { scheduleId } = req.params;
    const data = await req.json();
    if (scheduleId) {
      scheduleDetails.title = data.title;
      scheduleDetails.content = data.content;
      scheduleDetails.startTime = data.startTime;
      scheduleDetails.endTime = data.endTime;
    }
    return res(ctx.json(data.scheduleId));
  }
);

const getTempPlanList = rest.get(
  '/api/trips/:tripId/temporary-storage',
  async (req, res, ctx) => {
    await sleep(2000);

    const scheduleId = +req.url.searchParams.get('scheduleId')!;
    const size = +req.url.searchParams.get('size')!;

    if (!scheduleId) {
      return res(
        ctx.json({
          tempSchedules: tempPlan.slice(0, size),
          hasNext: size < tempPlan.length,
        })
      );
    }

    let formerLastIdx = null;

    for (let i = 0; i < tempPlan.length; i += 1) {
      if (tempPlan[i].scheduleId === scheduleId) {
        formerLastIdx = i;
        break;
      }
    }

    if (formerLastIdx) {
      return res(
        ctx.json({
          tempSchedules: tempPlan.slice(
            formerLastIdx + 1,
            formerLastIdx + 1 + size
          ),
          hasNext: formerLastIdx + 1 + size < tempPlan.length,
        })
      );
    }

    return res(ctx.status(400));
  }
);

const getTrip = rest.get('/api/trips/:tripId', async (req, res, ctx) => {
  await sleep(1000);
  const { tripId } = req.params;
  const response = tripList.find(trip => trip.tripId === +tripId);

  return res(ctx.json(response));
});

const handlers = [
  getAccessToken,
  refreshAccessToken,
  getExpiredAccessToken,
  checkRefreshToken,
  logout,
  getUserProfile,
  changeNickname,
  getUserInfo,
  getTripList,
  changeTripTitle,
  createTrip,
  deleteTrip,
  getDailyPlanList,
  createSchedule,
  changeScheduleOrder,
  deleteSchedule,
  getScheduleDetails,
  changeScheduleDetails,
  getTempPlanList,
  changeTripImg,
  changeTripPeriod,
  getTrip,
];

export default handlers;
