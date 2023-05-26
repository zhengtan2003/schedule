import {UserService} from './user.service'
import {Controller, Get, Request} from '@nestjs/common';
import {ApiOperation, ApiBearerAuth} from '@nestjs/swagger';


@Controller('user')
export class UserController {
    constructor(
        private readonly usersService: UserService,
    ) {
    }

    @ApiOperation({summary: '当前用户信息', operationId: 'currentUser'})
    @ApiBearerAuth()
    @Get('current')
    current(@Request() request) {
        return this.usersService.getUser(request.user.id);
    }
}

