import { IsUrl, IsOptional } from 'class-validator';

export class SubscribeDto {
    @IsUrl()
    @IsOptional()
    updateURL?: string;
}
