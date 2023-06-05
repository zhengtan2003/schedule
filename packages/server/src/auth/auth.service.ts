import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { Injectable } from '@nestjs/common';
import { HttpResponse } from '@/http-response';
import { UserService } from '@/user/user.service';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const user = await this.userService.findOne(
            { where: { username } },
            true,
        );
        if (!user) {
            const user = await this.userService.create({ username, password });
            const accessToken = this.jwtService.sign({ id: user.id });
            return new HttpResponse({
                data: { accessToken },
                message: '注册成功',
                showType: 1,
            });
        }
        if (!(await user.comparePassword(password))) {
            return new HttpResponse({
                message: '密码错误',
                showType: 1,
                success: false,
            });
        }
        const accessToken = this.jwtService.sign({ id: user.id });
        return new HttpResponse({
            data: { accessToken },
            message: '登录成功',
            showType: 1,
        });
    }
}
