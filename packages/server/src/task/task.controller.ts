import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { ToggleDto, UpsertTaskDto } from '@/task/dto/task.dto';
import { TaskService } from '@/task/task.service';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: '创建/更新' })
  @Post()
  upsert(@Body() upsertTaskDto: UpsertTaskDto, @User() user) {
    if (upsertTaskDto.id) return this.taskService.update(upsertTaskDto, user);
    return this.taskService.creat(upsertTaskDto, user);
  }

  @ApiOperation({ summary: '列表' })
  @Post('search')
  search(@Body() searchDto: SearchDto, @User() user) {
    return this.taskService.search(searchDto, user);
  }

  @ApiOperation({ summary: '删除' })
  @Delete()
  remove(@Query('id') id: string, @User() user) {
    return this.taskService.remove(+id, user);
  }

  @ApiOperation({ summary: '开始/停止' })
  @Post('toggle')
  toggle(@Body() toggleDto: ToggleDto, @User() user) {
    if (toggleDto.cronName) return this.taskService.stop(toggleDto, user);
    return this.taskService.start(toggleDto, user);
  }

  // @ApiOperation({ summary: '调试' })
  // @Get('debug')
  // debug(@Query('id') id: string, @User() user) {
  //   return this.taskService.debug(+id, user, true);
  // }

  @ApiOperation({ summary: '' })
  @Get()
  from(@Query('id') id: string, @User() user) {
    return this.taskService.from(+id, user);
  }
}
