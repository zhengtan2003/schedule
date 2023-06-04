import { IsNotEmpty } from 'class-validator';

export class CreateTaskLogDto {
    log: string;
    @IsNotEmpty()
    taskId: any;
    status: string;
}
