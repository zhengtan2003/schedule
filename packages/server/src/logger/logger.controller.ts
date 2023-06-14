import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoggerService } from './logger.service';

@ApiBearerAuth()
@ApiTags('logger')
@Controller('logger')
export class LoggerController {
  constructor(private readonly taskLogService: LoggerService) {}

  @Delete('remove')
  remove(@Query('envId') envId: string, @User() user) {
    return this.taskLogService.remove(+envId, user);
  }

  @ApiOperation({ summary: '🔍列表' })
  @Post('search')
  logSearch(@Body() searchDto: SearchDto, @User() user) {
    return this.taskLogService.search(searchDto, user);
  }
}
