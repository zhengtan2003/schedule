import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpsertTaskDto {
  @ApiProperty()
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id?: number;
  @ApiProperty()
  @IsOptional()
  name: string;
  @IsDateString()
  @IsOptional()
  startTime?: string;
  @IsDateString()
  @IsOptional()
  endTime?: string;
  @IsNotEmpty()
  cronTime: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  scriptId: number;
}

export class ToggleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id: number;
  @ApiProperty()
  @IsOptional()
  @IsString()
  cronName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString()
  cronTime?: string;
}
