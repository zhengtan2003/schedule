import {JwtService} from '@nestjs/jwt';
import {LoginDto} from './dto/login.dto';
import {RegisterDto} from './dto/register.dto';
import {UserService} from '../user/user.service';
import {Injectable, UnauthorizedException} from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {
    }

    async login(loginDto: LoginDto) {
        const {email, password} = loginDto;
        const user = await this.userService.findOne({email});
        if (!user) {
            const user = await this.userService.create(loginDto)
            const accessToken = this.jwtService.sign({id: user.id});
            return {
                success: true,
                data: {accessToken},
                message: "注册成功"
            }
        }
        // 验证用户密码
        if (!await user.comparePassword(password)) {
            throw new UnauthorizedException('Invalid username or password');
        }
        const accessToken = this.jwtService.sign({id: user.id});
        return {
            success: true,
            data: {accessToken},
            message: "登录成功"
        };
    }

    async register(registerDto: RegisterDto) {
        const {password, ...data} = await this.userService.create(registerDto);
        return {
            data,
            success: true
        };
    }
}
