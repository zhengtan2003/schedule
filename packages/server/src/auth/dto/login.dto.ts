import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty,IsEmail,IsStrongPassword} from "class-validator";

export class LoginDto {
    @ApiProperty({ example: '895898088@qq.com', description: '邮箱' })
    @IsEmail({},{ message: '邮箱格式错误' })
    email: string;
    @ApiProperty({ example: 123456, description: '密码' })
    // @IsStrongPassword()
    readonly password: string;
}