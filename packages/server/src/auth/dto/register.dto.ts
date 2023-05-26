import {ApiProperty} from "@nestjs/swagger";
import {IsNotEmpty} from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: '895898088@qq.com', description: '邮箱' })
    @IsNotEmpty({ message: '请输入邮箱' })
    readonly email: string;
    @ApiProperty({ example: 123456, description: '密码' })
    @IsNotEmpty({ message: '请输入密码' })
    readonly password: string;
}