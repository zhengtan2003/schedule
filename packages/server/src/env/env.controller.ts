import {EnvService} from './env.service';
import {ApiBearerAuth, ApiOperation, ApiTags} from '@nestjs/swagger';
import {Controller, Post, Body, Request, Query, Delete, Get} from '@nestjs/common';

@ApiTags('env')
@Controller('env')
export class EnvController {
    constructor(private envService: EnvService) {
    }

    @ApiOperation({summary: '更新', operationId: 'env_upsert'})
    @ApiBearerAuth()
    @Post()
    upsert(@Body() body, @Query('taskId') taskId, @Request() request) {
        return this.envService.upsert(body, taskId, request);
    }

    @ApiOperation({summary: '获取', operationId: 'env_get'})
    @ApiBearerAuth()
    @Get()
    get(@Query('id') id, @Request() request) {
        return this.envService.get(id, request);
    }

    @ApiOperation({summary: '删除', operationId: 'env_delete'})
    @ApiBearerAuth()
    @Delete()
    delete(@Query('id') id, @Request() request) {
        return this.envService.delete(id, request);
    }

    @ApiOperation({summary: '列表', operationId: 'env_search'})
    @ApiBearerAuth()
    @Post('search')
    search(@Body() body, @Request() request) {
        return this.envService.search(body, request);
    }
}
