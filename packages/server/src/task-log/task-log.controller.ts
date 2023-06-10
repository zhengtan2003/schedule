import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskLogService } from './task-log.service';

@ApiBearerAuth()
@ApiTags('taskLog')
@Controller('task/log')
export class TaskLogController {
  constructor(private readonly taskLogService: TaskLogService) {}

  @Delete('remove')
  remove(@Query('taskId') taskId: string, @User() user) {
    return this.taskLogService.remove(+taskId, user);
  }

  @ApiOperation({ summary: '🔍列表' })
  @Post('search')
  logSearch(@Body() searchDto: SearchDto, @User() user) {
    return this.taskLogService.search(searchDto, user);
  }
}
