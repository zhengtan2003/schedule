import { Like } from 'typeorm';
import { SearchDto } from '@/dto/search.dto';
import { isEmpty, defaultsDeep } from 'lodash';

const orderMap = {
    ascend: 'ASC',
    descend: 'DESC',
};
export const searchOptions = (searchDto: SearchDto, defaultOptions?: any) => {
    const { params, sort = {} } = searchDto;
    const { current = 1, pageSize = 10, ...retParams } = params;
    const options = {
        where: {},
        take: pageSize,
        order: {},
        skip: (current - 1) * pageSize,
    };
    Object.entries(retParams).forEach((item) => {
        const [key, value] = item;
        if (!isEmpty(value)) {
            options.where[key] = Like(`%${value}%`);
        }
    });
    Object.entries(sort).forEach((item) => {
        const [key, value] = item;
        options.order[key] = orderMap[value];
    });
    return defaultsDeep(defaultOptions, options);
};
