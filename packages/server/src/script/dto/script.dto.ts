import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class UpsertScriptDto {
    @IsNotEmpty()
    code: string;
    id?: string;
    name?: string;
    version?: string;
    language?: string;
    updateURL?: string;
    description?: string;
}

export class SubscribeDto {
    @IsUrl()
    @IsOptional()
    updateURL?: string;
}
