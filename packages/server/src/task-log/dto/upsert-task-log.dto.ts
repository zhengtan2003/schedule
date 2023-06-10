import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertTaskLogDto {
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id?: number;
  @IsNotEmpty()
  @IsInt()
  status: 0 | 1 | 2;
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  taskId: number;
  @IsOptional()
  @IsString()
  log?: string;
}
