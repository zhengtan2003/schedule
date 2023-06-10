import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TaskEnvDto } from './dto/task-env.dto';
import { TaskEnvService } from './task-env.service';

@ApiBearerAuth()
@ApiTags('taskEnv')
@Controller('task/env')
export class TaskEnvController {
  constructor(private readonly taskEnvService: TaskEnvService) {}

  @ApiOperation({ summary: '创建/更新' })
  @Post()
  upsertEnv(@Body() upsertTaskEnvDto: TaskEnvDto, @User() user) {
    if (upsertTaskEnvDto.id) {
      return this.taskEnvService.update(upsertTaskEnvDto, user);
    }
    return this.taskEnvService.create(upsertTaskEnvDto, user);
  }

  @ApiOperation({ summary: '删除' })
  @Delete()
  remove(@Query('id') id: string, @User() user) {
    return this.taskEnvService.remove(+id, user);
  }

  @ApiOperation({ summary: '🔍列表' })
  @Post('search')
  search(@Body() searchDto: SearchDto, @User() user) {
    return this.taskEnvService.search(searchDto, user);
  }

  @Get('from')
  form(@Query('id') id: string, @Query('taskId') taskId: string, @User() user) {
    if (!id) return {};
    return this.taskEnvService.form(+id, +taskId, user);
  }
}
