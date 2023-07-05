import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoggerDto {
  @IsOptional()
  @IsString()
  log?: string;
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  envId: number;
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  taskId: number;
  @IsNotEmpty()
  @IsNumber()
  executionTime: number;
}
