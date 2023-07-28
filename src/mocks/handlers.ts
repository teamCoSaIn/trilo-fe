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
    imageUrl: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  {
    tripId: 1,
    title: '발리 여행',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-09-11',
    endDate: '2023-09-14',
  },
  {
    tripId: 2,
    title: '2023 부산 여행',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/0304/b1fa/45b3c6de7187bb138e7099de0a1dfb3f?Expires=1682294400&Signature=kThV6-Fsjp1jdxtFz4H63msIV7qxx2Ptly3kPNTSIsmV6EGMbUDTUAKU7TkmsL5cw-dFkw9VVI1UFqO3AgzQ590Vzgy3oKTUB0mx7vO~is~fi334wDnFoHnZNK1l2nq77~DpiJ1wkStp-FpHfO9Y-2bWXhK5nSNoEVWiDqVUDfstouvzJnKmYuEMQNfv0i0k43xnZ-hu4vrvBLFDsa5AkygCANAjP3UUBPKmYZfDF-hSKcHkzk64RN~jffjeQtSHNd-8akS6Xy2uW3Ep5l4CEgjzoQwd6F-zlNeJbpPRt8KCMFFNyzTR1k~xoquN-lhJcG-s8V66pmbsD9G9EnzvlA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-07-11',
    endDate: '2023-07-15',
  },
  {
    tripId: 3,
    title: '23년 1월 괌 여행',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-07-14',
    endDate: '2023-07-19',
  },
  {
    tripId: 4,
    title: '2023 다낭계획',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'ON',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 5,
    title: '2023 다낭계획',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-03-25',
    endDate: '2023-03-27',
  },
  {
    tripId: 6,
    title: '2023 다낭계획',
    imageUrl: '',
    status: '',
    startDate: '',
    endDate: '',
  },
  {
    tripId: 7,
    title: '2023 제주 여행',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-03-25',
    endDate: '2023-03-27',
  },
  {
    tripId: 8,
    title: '2023 부산 여행',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/0304/b1fa/45b3c6de7187bb138e7099de0a1dfb3f?Expires=1682294400&Signature=kThV6-Fsjp1jdxtFz4H63msIV7qxx2Ptly3kPNTSIsmV6EGMbUDTUAKU7TkmsL5cw-dFkw9VVI1UFqO3AgzQ590Vzgy3oKTUB0mx7vO~is~fi334wDnFoHnZNK1l2nq77~DpiJ1wkStp-FpHfO9Y-2bWXhK5nSNoEVWiDqVUDfstouvzJnKmYuEMQNfv0i0k43xnZ-hu4vrvBLFDsa5AkygCANAjP3UUBPKmYZfDF-hSKcHkzk64RN~jffjeQtSHNd-8akS6Xy2uW3Ep5l4CEgjzoQwd6F-zlNeJbpPRt8KCMFFNyzTR1k~xoquN-lhJcG-s8V66pmbsD9G9EnzvlA__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 9,
    title: '23년 1월 괌 여행',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'BEFORE',
    startDate: '2023-07-25',
    endDate: '2023-07-27',
  },
  {
    tripId: 10,
    title: '2023 다낭계획',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/42e0/e6ed/d32374f2148dd5d0d4b792ce4a967827?Expires=1682294400&Signature=Yhsq8G6FgF~pYiGL00IWRlZZTi0kYVCkszFS1~CVyZm8giYMEb8m237SayXMHhQ-A2iGhDR1PlQuU~2hPAoe3LvHGhH2w92WV-KpDfJmPtbM3cgB9EMFfw0-tjPM-OO5GqcHEZyquqGeAUdBIWOE6pmA6R7DJWS9Ix~pjKtpvIA6MRjvXarb8-T7z2tl1DGpS56WTSl-8MTmhBHdBeioR39yp5Q3sybQf9KvTuNDAzR7K4QsOcKGxdk9smy3feLLX9UVBv7K1Gi7V18DveaZ7h0DlG~eGAlS-fXaI4pjAXi6LZFyedcE7e4kpdUrPx3rhT~ZZUZRaQ9jeUEvheX6rw__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'ON',
    startDate: '2023-08-20',
    endDate: '2023-08-22',
  },
  {
    tripId: 11,
    title: '2023 다낭계획',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-09-25',
    endDate: '2023-09-27',
  },
  {
    tripId: 12,
    title: '2023 오키나와계획',
    imageUrl:
      'https://s3-alpha-sig.figma.com/img/fc0a/bdc9/b5c73cf2f3111648643a68d4d03a5603?Expires=1682294400&Signature=GWAOm2~bFRjjYm7WsF~M-fnfWaAGNU79ettg9lRy7anIZIRNz6K-MBnEcXCcNV6eMyU69SqAdU9n3OW4bd0MH6lk7FAzfZ5t8QQPqWXuTnRO64oN42XcyUf4AjtDe7E1pGF9txfIR8pn4h6H2EmlSjCchv51UZoA99OZdxKqchIRDIrdHm~3LPFlg1deuBDpG0EA9Dx4HkFMhIZBFpL33vLfm-X5pm4Us2RJ58xpW-V2ehK6Arrz4C4v1F~ew4rQIcdvrYP6-e6-h~47GclmkYcBTAEbEEhqqAng2GxJC878MJkYRcNptjUx8FmTBQCZT9UCjIluQlWGQ~R~bfTQ0A__&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4',
    status: 'AFTER',
    startDate: '2023-09-25',
    endDate: '2023-09-27',
  },
];

const tripDays: IDailyPlan[] = [
  {
    dayId: 178,
    tripId: 7,
    date: '2023-09-19',
    dayColor: { name: 'VIOLET', code: '#8F57FB' },
    schedules: [
      {
        scheduleId: 87,
        title: 'Shanghai 21',
        placeName: 'Shanghai 21',
        placeId: 'ChIJTVG07iZawokRq9rPs7ib8bY',
        coordinate: {
          latitude: 40.714476284709335,
          longitude: -73.99890661239624,
        },
      },
      {
        scheduleId: 85,
        title: '원 월드 전망대',
        placeName: '원 월드 전망대',
        placeId: 'ChIJTWE_0BtawokRVJNGH5RS448',
        coordinate: { latitude: 40.7130062, longitude: -74.013173 },
      },
      {
        scheduleId: 82,
        title: '돌진하는 황소',
        placeName: '돌진하는 황소',
        placeId: 'ChIJURWoF5pYwokRIfXv4To528c',
        coordinate: {
          latitude: 40.704586878965245,
          longitude: -74.01386260986328,
        },
      },
      {
        scheduleId: 83,
        title: '레오즈 베이글즈',
        placeName: '레오즈 베이글즈',
        placeId: 'ChIJST0cgRZawokRZcRLEH3ylJ0',
        coordinate: {
          latitude: 40.704944744914734,
          longitude: -74.0097427368164,
        },
      },
      {
        scheduleId: 84,
        title: '사우스 페리',
        placeName: '사우스 페리',
        placeId: 'ChIJf7ZpaBNawokRroUHoA0MiU8',
        coordinate: {
          latitude: 40.702032961591094,
          longitude: -74.01339054107666,
        },
      },
      {
        scheduleId: 86,
        title: '배터리 공원',
        placeName: '배터리 공원',
        placeId: 'ChIJraKL-BJawokREpxDmF5GcL4',
        coordinate: { latitude: 40.70293119999999, longitude: -74.0153603 },
      },
    ],
  },
  {
    dayId: 179,
    tripId: 7,
    date: '2023-09-20',
    dayColor: { name: 'BLUE', code: '#4D77FF' },
    schedules: [
      {
        scheduleId: 88,
        title: '플랫아이언 빌딩',
        placeName: '플랫아이언 빌딩',
        placeId: 'ChIJZx8c96NZwokRJklw7SVhKt4',
        coordinate: { latitude: 40.7410605, longitude: -73.9896986 },
      },
      {
        scheduleId: 89,
        title: '코리아타운',
        placeName: '코리아타운',
        placeId: 'ChIJ_f1FDqlZwokRqCItRNuQIKs',
        coordinate: {
          latitude: 40.747744648563874,
          longitude: -73.98691177368164,
        },
      },
      {
        scheduleId: 90,
        title: '엠파이어 스테이트 빌딩',
        placeName: '엠파이어 스테이트 빌딩',
        placeId: 'ChIJaXQRs6lZwokRY6EFpJnhNNE',
        coordinate: {
          latitude: 40.74845991454198,
          longitude: -73.98566722869873,
        },
      },
      {
        scheduleId: 91,
        title: '더 모건 라이브러리 & 뮤지엄',
        placeName: '더 모건 라이브러리 & 뮤지엄',
        placeId: 'ChIJ3453OAdZwokRja92OOKCugM',
        coordinate: {
          latitude: 40.74924019592564,
          longitude: -73.98139715194702,
        },
      },
      {
        scheduleId: 92,
        title: '매디슨 스퀘어 가든',
        placeName: '매디슨 스퀘어 가든',
        placeId: 'ChIJhRwB-yFawokR5Phil-QQ3zM',
        coordinate: {
          latitude: 40.750508133646434,
          longitude: -73.99345636367798,
        },
      },
      {
        scheduleId: 93,
        title: 'RiseNY',
        placeName: 'RiseNY',
        placeId: 'ChIJc5zurnxZwokR8vn4ERqrSfc',
        coordinate: { latitude: 40.7576207, longitude: -73.98517609999999 },
      },
    ],
  },
  {
    dayId: 180,
    tripId: 7,
    date: '2023-09-21',
    dayColor: { name: 'RED', code: '#FB6C6C' },
    schedules: [
      {
        scheduleId: 94,
        title: '플라자 호텔',
        placeName: '플라자 호텔',
        placeId: 'ChIJYaVdffBYwokRnTOoCzCq9mE',
        coordinate: {
          latitude: 40.764648877123086,
          longitude: -73.97433757781982,
        },
      },
      {
        scheduleId: 95,
        title: '트럼프 타워',
        placeName: '트럼프 타워',
        placeId: 'ChIJrc9T9fpYwokRdvjYRHT8nI4',
        coordinate: {
          latitude: 40.76243856845116,
          longitude: -73.97382259368896,
        },
      },
      {
        scheduleId: 96,
        title: '뉴욕 현대 미술관',
        placeName: '뉴욕 현대 미술관',
        placeId: 'ChIJKxDbe_lYwokRVf__s8CPn-o',
        coordinate: {
          latitude: 40.761447156124,
          longitude: -73.97764205932617,
        },
      },
      {
        scheduleId: 97,
        title: '록펠러 센터',
        placeName: '록펠러 센터',
        placeId: 'ChIJ9U1mz_5YwokRosza1aAk0jM',
        coordinate: {
          latitude: 40.75874913950493,
          longitude: -73.97869348526001,
        },
      },
      {
        scheduleId: 98,
        title: '시그램 빌딩',
        placeName: '시그램 빌딩',
        placeId: 'ChIJzx9RX_tYwokRPF3szQ9WNyE',
        coordinate: {
          latitude: 40.758635365313474,
          longitude: -73.97180557250977,
        },
      },
      {
        scheduleId: 99,
        title: 'Ess-a-Bagel',
        placeName: 'Ess-a-Bagel',
        placeId: 'ChIJZyVQJONYwokREKv0a1J7bFI',
        coordinate: {
          latitude: 40.75621355419471,
          longitude: -73.9702820777893,
        },
      },
    ],
  },
  {
    dayId: 181,
    tripId: 7,
    date: '2023-09-22',
    dayColor: { name: 'PURPLE', code: '#D96FF8' },
    schedules: [
      {
        scheduleId: 102,
        title: 'Cafe d’Alsace',
        placeName: 'Cafe d’Alsace',
        placeId: 'ChIJ4Q06IbtYwokRcV8iHlJky_M',
        coordinate: {
          latitude: 40.77945279940329,
          longitude: -73.95090579986572,
        },
      },
      {
        scheduleId: 101,
        title: '메트로폴리탄 미술관',
        placeName: '메트로폴리탄 미술관',
        placeId: 'ChIJb8Jg9pZYwokR-qHGtvSkLzs',
        coordinate: {
          latitude: 40.77946904778007,
          longitude: -73.96326541900635,
        },
      },
      {
        scheduleId: 100,
        title: '센트럴 파크',
        placeName: '센트럴 파크',
        placeId: 'ChIJ4zGFAZpYwokRGUGph3Mf37k',
        coordinate: {
          latitude: 40.78255616725175,
          longitude: -73.96562576293945,
        },
      },
      {
        scheduleId: 103,
        title: '아메리칸 뮤지엄 오브 네츄럴 히스토리',
        placeName: '아메리칸 뮤지엄 오브 네츄럴 히스토리',
        placeId: 'ChIJCXoPsPRYwokRsV1MYnKBfaI',
        coordinate: {
          latitude: 40.781337584600486,
          longitude: -73.97399425506592,
        },
      },
      {
        scheduleId: 104,
        title: '링컨 센터',
        placeName: '링컨 센터',
        placeId: 'ChIJN6W-X_VYwokRTqwcBnTw1Uk',
        coordinate: {
          latitude: 40.772481879178564,
          longitude: -73.98352146148682,
        },
      },
      {
        scheduleId: 105,
        title: '카네기 홀',
        placeName: '카네기 홀',
        placeId: 'ChIJ2RFUePdYwokRd5R6XF6xFD0',
        coordinate: {
          latitude: 40.765136435316755,
          longitude: -73.97995948791504,
        },
      },
    ],
  },
  {
    dayId: 182,
    tripId: 7,
    date: '2023-09-23',
    dayColor: { name: 'GREEN', code: '#43D65A' },
    schedules: [
      {
        scheduleId: 106,
        title: '크리스토퍼 스트리트',
        placeName: '크리스토퍼 스트리트',
        placeId: 'ChIJqRXgsOxZwokR9ro8ANdGaUM',
        coordinate: {
          latitude: 40.73304748118843,
          longitude: -74.00708198547363,
        },
      },
      {
        scheduleId: 107,
        title: '휘트니 미술관',
        placeName: '휘트니 미술관',
        placeId: 'ChIJN3MJ6pRYwokRiXg91flSP8Y',
        coordinate: {
          latitude: 40.7395998275285,
          longitude: -74.00886297225952,
        },
      },
      {
        scheduleId: 108,
        title: '첼시 마켓',
        placeName: '첼시 마켓',
        placeId: 'ChIJw2lMFL9ZwokRosAtly52YX4',
        coordinate: {
          latitude: 40.74244493824738,
          longitude: -74.00615930557251,
        },
      },
      {
        scheduleId: 109,
        title: 'El Coco',
        placeName: 'El Coco',
        placeId: 'ChIJG6lhiZhZwokRAcLOOYxXGws',
        coordinate: {
          latitude: 40.74353417699336,
          longitude: -73.99948596954346,
        },
      },
      {
        scheduleId: 110,
        title: '루빈 박물관',
        placeName: '루빈 박물관',
        placeId: 'ChIJD4QSVbxZwokRaFPDajZtIaI',
        coordinate: {
          latitude: 40.74007131143137,
          longitude: -73.99772644042969,
        },
      },
    ],
  },
];

const tempPlan = [
  {
    scheduleId: 127,
    title: 'Pier 17',
    placeName: 'Pier 17',
    placeId: 'ChIJR1pTRTxawokRyzoX5XQ_alI',
    coordinate: {
      latitude: 40.70585566774556,
      longitude: -74.00193214416504,
    },
  },
  {
    scheduleId: 126,
    title: '주택박물관',
    placeName: '주택박물관',
    placeId: 'ChIJ20bVJYdZwokRhI7esP3mYM0',
    coordinate: {
      latitude: 40.7188187010832,
      longitude: -73.99010896682739,
    },
  },
  {
    scheduleId: 125,
    title: '피아노스',
    placeName: '피아노스',
    placeId: 'ChIJP-xJX4FZwokRyzyQJzIQqXI',
    coordinate: {
      latitude: 40.72106298503115,
      longitude: -73.98774862289429,
    },
  },
  {
    scheduleId: 124,
    title: '톰프킨스 스퀘어 공원',
    placeName: '톰프킨스 스퀘어 공원',
    placeId: 'ChIJgTDll51ZwokRVjN7KXztwXY',
    coordinate: {
      latitude: 40.72644570551446,
      longitude: -73.98180484771729,
    },
  },
  {
    scheduleId: 123,
    title: '빌리지 뷰 HVAC',
    placeName: '빌리지 뷰 HVAC',
    placeId: 'ChIJ23l16IJZwokR0aWv7YjShhA',
    coordinate: {
      latitude: 40.72473824313938,
      longitude: -73.98504495620728,
    },
  },
  {
    scheduleId: 122,
    title: "Au Za'atar",
    placeName: "Au Za'atar",
    placeId: 'ChIJ7bngQXZZwokRQtaUAwUwyJA',
    coordinate: {
      latitude: 40.728933643694994,
      longitude: -73.98124694824219,
    },
  },
  {
    scheduleId: 121,
    title: 'Le Sia',
    placeName: 'Le Sia',
    placeId: 'ChIJq2WjhLVZwokRBNFohweL-NA',
    coordinate: { latitude: 40.7607527, longitude: -73.9912784 },
  },
  {
    scheduleId: 120,
    title: 'Le Rivage',
    placeName: 'Le Rivage',
    placeId: 'ChIJP9968FNYwokRluXA9d7952g',
    coordinate: { latitude: 40.7602192, longitude: -73.9895726 },
  },
  {
    scheduleId: 119,
    title: 'The Ride NYC',
    placeName: 'The Ride NYC',
    placeId: 'ChIJ8VOfr1RYwokRf7vY-6TOTD4',
    coordinate: {
      latitude: 40.75720949999999,
      longitude: -73.98933099999999,
    },
  },
  {
    scheduleId: 118,
    title: 'The Pier 62 Carousel',
    placeName: 'The Pier 62 Carousel',
    placeId: 'ChIJjXchKcZZwokRF_NRs9G0Mk0',
    coordinate: { latitude: 40.7487255, longitude: -74.01023409999999 },
  },
  {
    scheduleId: 117,
    title: '그릴리 스퀘어 공원',
    placeName: '그릴리 스퀘어 공원',
    placeId: 'ChIJEeWrKalZwokRg6qlyNqcv2A',
    coordinate: { latitude: 40.7487058, longitude: -73.9883382 },
  },
  {
    scheduleId: 116,
    title: '크라이슬러 빌딩',
    placeName: '크라이슬러 빌딩',
    placeId: 'ChIJeWPFRwJZwokRGD60OOo74RU',
    coordinate: { latitude: 40.7516208, longitude: -73.97550199999999 },
  },
  {
    scheduleId: 115,
    title: '브라이언트 공원',
    placeName: '브라이언트 공원',
    placeId: 'ChIJvbGg56pZwokRp_E3JbivnLQ',
    coordinate: { latitude: 40.7535965, longitude: -73.9832326 },
  },
  {
    scheduleId: 114,
    title: 'Icy Park',
    placeName: 'Icy Park',
    placeId: 'ChIJWzrKC7JZwokRj-MUKGYTPkQ',
    coordinate: { latitude: 40.7539141, longitude: -73.9853115 },
  },
  {
    scheduleId: 113,
    title: 'Door to Nowhere',
    placeName: 'Door to Nowhere',
    placeId: 'ChIJd0r0eSlZwokR2hUO_-AOq8w',
    coordinate: { latitude: 40.7556389, longitude: -73.9863542 },
  },
  {
    scheduleId: 112,
    title: 'Edge',
    placeName: 'Edge',
    placeId: 'ChIJ3aqq5Q1ZwokRb9hLO7Gyxgw',
    coordinate: { latitude: 40.7541236, longitude: -74.00097439999999 },
  },
  {
    scheduleId: 111,
    title: 'AMC Village 7',
    placeName: 'AMC Village 7',
    placeId: 'ChIJ_4vCq55ZwokRIjJSXWnH_0c',
    coordinate: {
      latitude: 40.731616610038316,
      longitude: -73.988778591156,
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
      dayColor: {
        name: 'RED',
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
  scheduleTime: {
    startTime: '10:00',
    endTime: '12:30',
  },
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiIsImV4cCI6MjU1MTYyMzAwMH0.szO4PXFqterxdRWwHStGa8_tLwiUWfbk8YkqRjjhBpk',
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
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiSm9obiIsImV4cCI6MTUxNjIzMDAwfQ.DkYEArJo61STQGfEVff_h3Petbbi8YUf3rar0Fp64MU',
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

const getUserProfile = rest.get(
  '/api/users/:userId/profile',
  async (req, res, ctx) => {
    await sleep(2000);
    return res(
      ctx.json({
        id: 1,
        nickName: nickname,
        profileImageURL:
          'https://avatars.githubusercontent.com/u/84956036?s=40&v=4',
        authProvider: 'GOOGLE',
        role: 'MEMBER',
      })
    );
  }
);

const changeNickname = rest.patch(
  '/api/users/:userId',
  async (req, res, ctx) => {
    const { nickName: newNickname } = await req.json();
    nickname = newNickname;
    await sleep(1000);

    return res(ctx.status(200));
  }
);

const getUserInfo = rest.get(
  '/api/users/:userId/my-page',
  async (req, res, ctx) => {
    return res(
      ctx.json({
        nickName: 'Oliver',
        imageURL:
          'https://user-images.githubusercontent.com/84956036/227441024-9853dda6-2100-466a-af20-b13d2e720f5f.png',
        tripStatistics: {
          totalTripCnt: 13,
          terminatedTripCnt: 3,
        },
      })
    );
  }
);

const getTripList = rest.get(
  '/api/trippers/:tripperId/trips',
  async (req, res, ctx) => {
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
  }
);

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
    imageUrl: '',
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
      return res(ctx.json({ days: tripCardIds[tripId as string] }));
    }
    return res(ctx.status(400));
  }
);

const createSchedule = rest.post('/api/schedules', async (req, res, ctx) => {
  await sleep(2000);
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

const changeScheduleOrder = rest.put(
  '/api/schedules/:scheduleId/position',
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
      scheduleDetails.scheduleTime.startTime = data.startTime;
      scheduleDetails.scheduleTime.endTime = data.endTime;
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

const changeDayColor = rest.put(
  '/api/days/:dayId/color',
  async (req, res, ctx) => {
    await sleep(1000);
    return res(ctx.status(200));
  }
);

const resign = rest.delete('/api/users/:userId', async (req, res, ctx) => {
  await sleep(1000);
  return res(ctx.status(204));
});

const requestChat = rest.post(
  'https://api.openai.com/v1/chat/completions',
  async (req, res, ctx) => {
    await sleep(1000);
    const body = await req.json();
    const { content } = body.messages[body.messages.length - 1];
    return res(
      ctx.json({
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        choices: [
          {
            index: 0,
            message: {
              role: 'assistant',
              content: `${content}에 대한 응답입니다.`,
            },
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 9,
          completion_tokens: 12,
          total_tokens: 21,
        },
      })
    );
  }
);

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
  changeDayColor,
  resign,
  requestChat,
];

export default handlers;
