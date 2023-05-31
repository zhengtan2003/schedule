import {LoginDto} from './dto/login.dto';
import {AuthService} from './auth.service';
import {Public} from './decorators/public.decorator';
import {Controller, Post, Body, HttpCode, HttpStatus} from '@nestjs/common';
import {ApiTags, ApiOperation, ApiBody} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {
    }

    @ApiOperation({summary: '登录', operationId: "authLogin"})
    @ApiBody({type: LoginDto})
    @Public()
    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
