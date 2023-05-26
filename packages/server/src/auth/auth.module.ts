import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {APP_GUARD} from '@nestjs/core';
import {AuthGuard} from './auth.guard';
import {jwtConstants} from './constants';
import {AuthService} from './auth.service';
import {UserModule} from '../user/user.module';
import {AuthController} from './auth.controller';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: {expiresIn: '1000h'},
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        AuthService,
    ],
    controllers: [AuthController],
})
export class AuthModule {
}
