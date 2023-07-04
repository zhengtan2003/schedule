import moment from 'moment';

export const toMomentFormat = (inp?: moment.MomentInput) => {
  return moment(inp).format('YYYY-MM-DD HH:mm:ss');
};
