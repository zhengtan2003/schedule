import * as dayjs from 'dayjs';

export const toISOString = (value): Date => {
  if (!value) return;
  const day = dayjs(value);
  if (day.isValid()) {
    return day.toDate();
  }
};
