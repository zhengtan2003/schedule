import dayjs from 'dayjs';

export const toDateTimeString = (value: any) => {
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
};
