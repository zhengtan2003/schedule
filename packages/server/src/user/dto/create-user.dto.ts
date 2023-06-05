import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({ example: 'admin', description: '用户名' })
    @IsNotEmpty()
    username: string;
    @ApiProperty({ example: 123456, description: '密码' })
    @IsNotEmpty()
    password: string;
}
