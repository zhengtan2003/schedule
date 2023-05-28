import {faker} from '@faker-js/faker';
import {IsNotEmpty} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class UserDto {
    @ApiProperty({example: faker.internet.avatar(), description: '头像'})
    avatar?: string;
    @ApiProperty({example: faker.internet.email(), description: '邮箱'})
    @IsNotEmpty({message: '请输入邮箱'})
    email: string;
    @ApiProperty({example: 123456, description: '密码'})
    @IsNotEmpty({message: '请输入密码'})
    password: string;
    @ApiProperty({example: faker.person.fullName(), description: '昵称'})
    name?: string;
}
