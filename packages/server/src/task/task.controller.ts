import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Query,
    Delete,
} from '@nestjs/common';
import { TaskService } from '@/task/task.service';
import { CreateTaskDto } from '@/task/dto/create-task.dto';
import { UpdateTaskDto } from '@/task/dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { UpsertTaskEnvDto } from '@/task/dto/upsert-task-env.dto';
import { EnvAntdFromQueryDto } from '@/task/dto/task-env.dto';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @ApiOperation({ summary: '创建/更新' })
    @Post()
    upsert(@Body() createTaskDto: CreateTaskDto, @User() user) {
        return this.taskService.create(createTaskDto, user);
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

    @ApiOperation({ summary: '开始' })
    @Get('start')
    start(@Query('id') id: string, @User() user) {
        return this.taskService.start(+id, user);
    }

    @ApiOperation({ summary: '停止' })
    @Get('stop')
    stop(@Query('id') id: string, @User() user) {
        return this.taskService.stop(+id, user);
    }

    @ApiOperation({ summary: '调试' })
    @Get('debug')
    debug(@Query('id') id: string, @User() user) {
        return this.taskService.debug(+id, user);
    }

    //env
    @ApiOperation({ summary: '创建env/更新env' })
    @Post('env')
    upsertEnv(@Body() upsertTaskEnvDto: UpsertTaskEnvDto, @User() user) {
        if (upsertTaskEnvDto.id) {
            return this.taskService.updateEnv(upsertTaskEnvDto, user);
        }
        return this.taskService.creatEnv(upsertTaskEnvDto, user);
    }

    @ApiOperation({ summary: '删除env' })
    @Delete('env')
    removeEnv(
        @Query('id') id: string,
        @Query('taskId') taskId: string,
        @User() user,
    ) {
        return this.taskService.removeEnv({ id, taskId }, user);
    }

    @ApiOperation({ summary: 'env列表' })
    @Post('env/search')
    envSearch(@Body() searchDto: SearchDto, @User() user) {
        return this.taskService.envSearch(searchDto, user);
    }

    @ApiOperation({ summary: '用于antd from组件' })
    @Get('env/antd/from')
    envAntdFrom(
        @Query() envAntdFromQueryDto: EnvAntdFromQueryDto,
        @User() user,
    ) {
        return this.taskService.envAntdFrom(envAntdFromQueryDto, user);
    }

    //log
    @ApiOperation({ summary: '获得日志' })
    @Post('log/search')
    logSearch(@Body() searchDto: SearchDto) {
        return this.taskService.logSearch(searchDto);
    }

    @Post('log/remove/all')
    removeAllLog(@Query('taskId') taskId: string, @User() user) {
        return this.taskService.removeAllLog(taskId, user);
    }
}
