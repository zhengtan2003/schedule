import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.userService.repository().findOne({ where: { email } });
        if (!user) {
            const user = await this.userService.create(loginDto);
            const accessToken = this.jwtService.sign({ id: user.id });
            return {
                data: { accessToken },
                message: '注册成功',
                showType: 1,
            };
        }
        if (!(await user.comparePassword(password))) {
            throw new BadRequestException('密码错误');
        }
        const accessToken = this.jwtService.sign({ id: user.id });
        return {
            data: { accessToken },
            message: '登录成功',
            showType: 1,
        };
    }

    async register(registerDto: RegisterDto) {
        const { password, ...data } = await this.userService.create(registerDto);
        return {
            data,
            success: true,
        };
    }
}
