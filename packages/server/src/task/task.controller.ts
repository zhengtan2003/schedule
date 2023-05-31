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
import {QueryDTO} from "./dto/query.dto";

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
    upsertUpload(
        @UploadedFile() file,
        @Request() request
    ) {
        const buffer = Buffer.from(file.originalname, 'binary');
        return this.taskService.upsert({
            code: file.buffer.toString(),
            filename: buffer.toString()
        }, request);
    }

    @ApiOperation({summary: '新建(远程获取)', operationId: 'task_upsertRemote'})
    @ApiBearerAuth()
    @Post('remote')
    async upsertRemote(@Body() {id, updateURL}, @Request() request) {
        const {data} = await firstValueFrom(this.httpService.get(updateURL));
        const filename = updateURL.split('/').pop();
        return this.taskService.upsert({
            id,
            code: data,
            updateURL,
            filename
        }, request);
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
    delete(@Query() queryDTO: QueryDTO, @Request() request) {
        return this.taskService.delete(queryDTO.id, request);
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
    start(@Query() queryDTO: QueryDTO, @Request() request) {
        return this.taskService.start(queryDTO.id, request);
    }

    @ApiOperation({summary: '停止任务', operationId: 'task_stop'})
    @ApiBearerAuth()
    @Post('stop')
    stop(@Query() queryDTO: QueryDTO, @Request() request) {
        return this.taskService.stop(queryDTO.id, request);
    }
}
