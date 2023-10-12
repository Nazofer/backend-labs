export const getFormattedDate = () => {
  const date = new Date();
  const lang = 'en-US';
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'Europe/Kyiv',
  };
  const formattedDate = new Intl.DateTimeFormat(lang, options).format(date);

  return formattedDate;
};
