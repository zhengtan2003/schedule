import {firstValueFrom} from 'rxjs';
import {HttpService} from '@nestjs/axios';
import {TaskService} from './task.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Query,
    Request,
    Param,
    UseInterceptors,
    UploadedFile,
} from '@nestjs/common';

@ApiTags('task')
@Controller('task')
export class TaskController {
    constructor(
        private taskService: TaskService,
        private httpService: HttpService,
    ) {
    }

    @ApiOperation({summary: '新建(上传文件)', operationId: 'task_upsertUpload'})
    @ApiBearerAuth()
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    upsertUpload(@UploadedFile() file, @Request() request) {
        const code = file.buffer.toString();
        const fileName = file.originalname;
        return this.taskService.upsert({code, fileName}, request);
    }

    @ApiOperation({summary: '新建(远程获取)', operationId: 'task_upsertRemote'})
    @ApiBearerAuth()
    @Post('remote')
    async upsertRemote(@Body() {id, updateURL}, @Request() request) {
        const {data} = await firstValueFrom(this.httpService.get(updateURL));
        return this.taskService.upsert({id, code: data, updateURL}, request);
    }

    @ApiOperation({summary: '读取', operationId: 'task_get'})
    @ApiBearerAuth()
    @Get()
    get(@Param('id') id) {
        return this.taskService.get(id);
    }

    @ApiOperation({summary: '删除', operationId: 'task_delete'})
    @ApiBearerAuth()
    @Delete()
    delete(@Query('id') id, @Request() request) {
        return this.taskService.delete(id, request);
    }

    @ApiOperation({summary: '列表', operationId: 'task_search'})
    @ApiBearerAuth()
    @Post('search')
    search(@Body() body, @Request() request) {
        return this.taskService.search(body, request);
    }

    @ApiOperation({summary: '开始任务', operationId: 'task_start'})
    @ApiBearerAuth()
    @Post('start')
    start(@Query('id') id, @Request() request) {
        return this.taskService.start(id, request);
    }

    @ApiOperation({summary: '停止任务', operationId: 'task_stop'})
    @ApiBearerAuth()
    @Post('stop')
    stop(@Query('id') id, @Request() request) {
        return this.taskService.stop(id, request);
    }
}
