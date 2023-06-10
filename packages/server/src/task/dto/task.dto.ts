import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpsertTaskDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id?: number;
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
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  scriptId: number;
}
