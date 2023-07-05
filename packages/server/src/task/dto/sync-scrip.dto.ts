import { IsArray, IsNotEmpty } from 'class-validator';

export class SyncScripDto {
  @IsNotEmpty()
  id: string;
  @IsArray()
  @IsNotEmpty()
  scriptIds: any[];
}
