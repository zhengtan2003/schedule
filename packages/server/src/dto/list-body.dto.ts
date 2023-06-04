import { IsNotEmpty } from 'class-validator';

export class ListBodyDto {
    @IsNotEmpty()
    params: {
        pageSize?: number;
        current?: number;
    };

    sort: Record<string, any>;

    filter: Record<string, any>;
}