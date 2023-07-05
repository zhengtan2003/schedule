import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateScripExtDto {
  @IsNotEmpty()
  id: string;
  @IsNotEmpty()
  scriptId: number;
  @IsString()
  @IsNotEmpty()
  cronTime: string;
}
