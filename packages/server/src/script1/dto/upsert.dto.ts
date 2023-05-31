import { IsNotEmpty } from 'class-validator';

export class UpsertDto {
  @IsNotEmpty()
  fileName: string;
  version: string;
  updateURL: string;
  description: string;
  @IsNotEmpty()
  code:string;
}
