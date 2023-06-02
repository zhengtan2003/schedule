import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateScriptDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsString()
    @IsNotEmpty()
    code: string;
    @IsString()
    @IsNotEmpty()
    language: string;
    @IsString()
    @IsOptional()
    remark?: string;
}
