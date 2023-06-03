import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskLogDto {
    log: string;
    @IsNotEmpty()
    taskId:string
}
