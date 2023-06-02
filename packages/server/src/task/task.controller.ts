import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../decorators/user.decorator';
import { ListBodyDto } from '../dto/list-body.dto';

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

    @ApiOperation({ summary: '列表'})
    @Post('list')
    list(@Body() listBody: ListBodyDto, @Request() request) {
        return this.taskService.list(listBody, request);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.taskService.findOne(+id);
    }

    @ApiOperation({ summary: '更新' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
        return this.taskService.update(+id, updateTaskDto);
    }

    @ApiOperation({ summary: '删除' })
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.taskService.remove(+id);
    }
}
