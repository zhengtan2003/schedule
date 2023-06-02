import { ApiProperty } from '@nestjs/swagger';
import { faker } from '@faker-js/faker';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @ApiProperty({example: faker.internet.email(), description: '邮箱'})
    @IsNotEmpty({message: '请输入邮箱'})
    email: string;
    @ApiProperty({example: 123456, description: '密码'})
    @IsNotEmpty({message: '请输入密码'})
    password: string;
}
