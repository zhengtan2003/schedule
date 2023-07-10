import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateScripExtDto {
  @IsNotEmpty()
  taskId: string;
  @IsNotEmpty()
  scriptId: number;
  @IsString()
  @IsNotEmpty()
  cronTime: string;
  @IsString()
  @IsOptional()
  cronName?: string;
  @IsNumber()
  executeType: 1 | 2;
}
