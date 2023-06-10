import { isObject } from 'lodash';

const orderMap = {
  ascend: 'ASC',
  descend: 'DESC',
};
export const searchOrder = (sort) => {
  if (!isObject(sort)) return;
  const order = {};
  Object.entries(sort).forEach((item) => {
    const [key, value] = item;
    order[key] = orderMap[value as any];
  });
  return order;
};
