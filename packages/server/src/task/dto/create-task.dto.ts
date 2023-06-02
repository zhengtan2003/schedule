import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateTaskDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsDateString()
    @IsOptional()
    startTime?: string;
    @IsDateString()
    @IsOptional()
    endTime?: string;
    cronTime?: string;
}
