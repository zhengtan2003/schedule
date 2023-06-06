import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpsertScriptDto {
    @IsOptional()
    id: string;
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    language: string;
    updateURL?: string;
    remark?: string;
}

export class SubscribeDto {
    @IsUrl()
    @IsOptional()
    updateURL?: string;
}
