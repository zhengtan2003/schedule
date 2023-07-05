import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { CreateTaskDto } from '@/task/dto/creat-task.dto';
import { SyncScripDto } from '@/task/dto/sync-scrip.dto';
import { UpdateScripExtDto } from '@/task/dto/update-scrip-ext.dto';
import { UpdateTaskDto } from '@/task/dto/update-task.dto';
import { TaskService } from '@/task/task.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // @ApiOperation({ summary: '创建/更新' })
  // @Post()
  // upsert(@Body() upsertTaskDto: UpdateTaskDto, @User() user) {
  //   if ('id' in upsertTaskDto)
  //     return this.taskService.update(upsertTaskDto, user);
  //   return this.taskService.creat(upsertTaskDto, user);
  // }
  @Post()
  creat(@Body() createTaskDto: CreateTaskDto, @User() user) {
    return this.taskService.creat(createTaskDto, user);
  }

  @Put()
  update(@Body() updateTaskDto: UpdateTaskDto, @User() user) {
    return this.taskService.update(updateTaskDto, user);
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
  toggle(@Body('id') id, @User() user) {
    return this.taskService.toggle(+id, user);
  }

  @ApiOperation({ summary: 'Antd From 组件' })
  @Get('from')
  from(@Query('id') id: string, @User() user) {
    return this.taskService.from(+id, user);
  }

  @ApiOperation({ summary: '任务关联的脚本列表' })
  @Get('script')
  script(@Query('id') id: string, @User() user) {
    return this.taskService.script(+id, user);
  }

  @ApiOperation({ summary: '任务详情' })
  @Get('details')
  details(@Query('id') id: string, @User() user) {
    return this.taskService.details(+id, user);
  }

  @ApiOperation({ summary: '任务与脚本关联同步' })
  @Post('syncScrip')
  syncScrip(@Body() syncScripDto: SyncScripDto, @User() user) {
    return this.taskService.syncScrip(syncScripDto, user);
  }

  @ApiOperation({ summary: '更新任务的脚本Ext' })
  @Post('scripExt')
  updateScripExt(@Body() updateScripExtDto: UpdateScripExtDto, @User() user) {
    return this.taskService.updateScripExt(updateScripExtDto, user);
  }
}
