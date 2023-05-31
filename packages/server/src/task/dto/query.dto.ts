import {IsNotEmpty} from 'class-validator';

export class QueryDTO {
    @IsNotEmpty()
    id: string;
}
