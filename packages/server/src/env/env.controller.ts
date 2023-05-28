import {Controller, Post, Body, Request, Query, Delete, Get} from '@nestjs/common';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {EnvService} from './env.service';

@ApiTags('env')
@Controller('env')
export class EnvController {
    constructor(private service: EnvService) {
    }

    @ApiOperation({summary: '更新', operationId: 'env_upsert'})
    @ApiBearerAuth()
    @Post()
    upsert(@Body() body, @Query('taskId') taskId, @Request() request) {
        return this.service.upsert(body, taskId, request);
    }

    @ApiOperation({summary: '获取', operationId: 'env_get'})
    @ApiBearerAuth()
    @Get()
    get(@Query('id') id, @Request() request) {
        return this.service.get(id, request);
    }

    @ApiOperation({summary: '删除', operationId: 'env_delete'})
    @ApiBearerAuth()
    @Delete()
    delete(@Query('id') id, @Request() request) {
        return this.service.delete(id, request);
    }

    @ApiOperation({summary: '列表', operationId: 'env_search'})
    @ApiBearerAuth()
    @Post('search')
    search(@Body() body, @Request() request) {
        return this.service.search(body, request);
    }
}
