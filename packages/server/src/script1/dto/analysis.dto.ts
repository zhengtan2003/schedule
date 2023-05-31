import { IsNotEmpty } from 'class-validator';

export class AnalysisDto {
  @IsNotEmpty()
  url: string;
}
