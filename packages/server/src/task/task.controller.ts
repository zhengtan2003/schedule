import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Query,
    Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';

@ApiBearerAuth()
@ApiTags('task')
@Controller('task')
export class TaskController {
    constructor(private readonly taskService: TaskService) {}

    @ApiOperation({ summary: '创建' })
    @Post()
    create(@Body() createTaskDto: CreateTaskDto, @User() user) {
        return this.taskService.create(createTaskDto, user);
    }

    @ApiOperation({ summary: '列表' })
    @Post('search')
    search(@Body() searchDto: SearchDto, @User() user) {
        return this.taskService.search(searchDto, user);
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
    @ApiOperation({ summary: '停止' })
    @Get('stop')
    stop(@Query('id') id: string, @User() user) {
        return this.taskService.stop(+id, user);
    }
    @ApiOperation({ summary: '获得日志' })
    @Post('log/search')
    logSearch(@Body() searchDto: SearchDto) {
        return this.taskService.logSearch(searchDto);
    }
}
