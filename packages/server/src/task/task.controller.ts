import { Controller, Get, Post, Body, Patch, Query, Delete, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@/decorators/user.decorator';
import { ListBodyDto } from '@/dto/list-body.dto';
import { CreateTaskLogDto } from '@/task/dto/create-task-log.dto';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {
    }

    @ApiOperation({ summary: '创建' })
    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @User() user) {
        return this.taskService.create(createTaskDto, user);
    }

    @ApiOperation({ summary: '列表' })
    @Post('list')
    list(@Body() listBody: ListBodyDto, @User() user) {
        return this.taskService.list(listBody, user);
    }

    @Get()
    findOne(@Query('id') id: string) {
        return this.taskService.findOne(+id);
    }

    @ApiOperation({ summary: '更新' })
    @Patch()
    update(@Query('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.taskService.update(+id, updateTaskDto);
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
    @ApiOperation({summary:'停止'})
    @Get('stop')
    stop(@Query('id') id: string, @User() user){
        return this.taskService.stop(+id, user);
    }
    @ApiOperation({summary:'创建日志'})
    @Post('log')
    createLog(@Body() createTaskLogDto: CreateTaskLogDto, @User() user) {
        return this.taskService.createLog(createTaskLogDto);
    }
    @ApiOperation({summary:'获得日志'})
    @Post('log/list')
    logList(@Body() listBody: ListBodyDto){
        return this.taskService.logList(listBody);
    }
}
