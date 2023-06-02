import { IsNotEmpty } from 'class-validator';

export class OptionsQueryDto {
    @IsNotEmpty()
    params: {
        pageSize?: number;
        current?: number;
    };
    @IsNotEmpty()
    sort: Record<string, any>;
    @IsNotEmpty()
    filter: Record<string, any>;
}