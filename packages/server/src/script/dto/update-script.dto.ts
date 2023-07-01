import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateScriptDto } from './creat-script.dto';

export class UpdateScriptDto extends PartialType(CreateScriptDto) {
  id?: number;
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  language: string;
}
