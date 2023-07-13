import moment from 'moment';

export const toDateTimeString = (value: any) => {
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
};
