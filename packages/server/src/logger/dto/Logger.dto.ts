import { Transform } from 'class-transformer';
import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class LoggerDto {
  @IsEmpty()
  @IsString()
  scriptName: string;
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
