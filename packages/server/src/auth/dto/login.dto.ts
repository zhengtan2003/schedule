import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'admin', description: '邮箱' })
    @IsNotEmpty()
    username: string;
    @ApiProperty({ example: 123456, description: '密码' })
    @IsNotEmpty()
    readonly password: string;
}
