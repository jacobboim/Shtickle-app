export const getDayOfTheYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  // console.log(day);
  return day;
};

export const copyArray = (arr) => {
  return [...arr.map((rows) => [...rows])];
};

export const getYear = () => {
  const now = new Date();
  return now.getFullYear();
};

export const getDayKey = () => {
  const d = new Date();
  let year = d.getFullYear();
  let hour = d.getHours();
  let seconds = d.getSeconds();

  let standardHour = hour % 12;

  console.log(standardHour, "standardHour");
  let minute = d.getMinutes();
  return `day-${getDayOfTheYear()}-${year}-${standardHour}-${minute}`;
};
