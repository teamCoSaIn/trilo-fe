export interface DateInfo {
  year: number;
  month: number;
  date: number;
}

export const getDateInfoArray = (date: Date): DateInfo[][] => {
  const year = date.getFullYear();
  const monthIdx = date.getMonth();
  const firstDay = new Date(year, monthIdx, 1).getDay();
  const lastDateObj = new Date(year, monthIdx + 1, 0);
  const lastDate = lastDateObj.getDate();
  const lastDay = lastDateObj.getDay();
  const prevLastDate = new Date(year, monthIdx, 0).getDate();

  const prevLastWeek = Array.from({ length: firstDay }, (_, idx) => {
    return { year, month: monthIdx, date: prevLastDate - idx };
  }).reverse();
  const curMonth = Array.from({ length: lastDate }, (_, idx) => {
    return { year, month: monthIdx + 1, date: idx + 1 };
  });
  const nextFirstWeek = Array.from({ length: 6 - lastDay }, (_, idx) => {
    return { year, month: monthIdx + 2, date: idx + 1 };
  });

  const allDates = [...prevLastWeek, ...curMonth, ...nextFirstWeek];
  const dateInfoArray = [];
  for (let i = 0; i < Math.ceil(allDates.length / 7); i += 1) {
    const week = allDates.slice(i * 7, (i + 1) * 7);
    dateInfoArray.push(week);
  }
  return dateInfoArray;
};

// 형식 변환 : 2021.04.19
export const transformDateToDotFormat = (date: Date) => {
  //  '2021. 4. 19. 오전 12:00:00'
  const localeStringFormat = date.toLocaleString();
  const [yearStr, monthStr, dateStr] = localeStringFormat
    .replace(/\./g, '')
    .split(' ')
    .slice(0, 3);
  return monthStr.length === 1
    ? `${yearStr}.0${monthStr}.${dateStr}`
    : `${yearStr}.${monthStr}.${dateStr}`;
};
