import { IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class UpsertTaskDto {
    @IsOptional()
    id?: string;
    @IsOptional()
    name: string;
    @IsDateString()
    @IsOptional()
    startTime?: string;
    @IsDateString()
    @IsOptional()
    endTime?: string;
    cronTime?: string;
    @IsNotEmpty()
    scriptId: string;
}
