import { UserService } from './user.service';
import { Controller, Get, Request } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOperation({ summary: '当前用户信息', operationId: 'user_current' })
  @ApiBearerAuth()
  @Get('current')
  current(@Request() { user }) {
    return this.usersService.getUser(user.id);
  }
}
