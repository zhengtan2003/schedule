import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateScriptDto {
  @IsString()
  @IsNotEmpty()
  code: string;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  language: string;
  /**
   * 版本，更新时先用这个字段做对比
   */
  @IsString()
  @IsOptional()
  version?: string;
  /**
   * 不同语言的脚本，需要不同的启动命令
   */
  updateURL?: string;
  @IsString()
  @IsOptional()
  description?: string;
}
