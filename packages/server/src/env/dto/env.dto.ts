import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpsertTaskEnvDto {
  @IsOptional()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  id?: number;
  @IsNotEmpty()
  code: string;
  @IsNotEmpty()
  @IsInt()
  @Transform(({ value }) => parseInt(value))
  taskId: number;
  @IsOptional()
  @IsString()
  description?: string;
}
