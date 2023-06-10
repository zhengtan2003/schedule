import { isEmpty } from 'lodash';
import { Like } from 'typeorm';

export const searchParams = (params) => {
  const where = {};
  Object.entries(params).forEach((item) => {
    const [key, value] = item;
    if (!isEmpty(value)) {
      where[key] = Like(`%${value}%`);
    }
  });
  return where;
};
