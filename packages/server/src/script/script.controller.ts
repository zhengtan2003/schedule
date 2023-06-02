import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { ScriptService } from './script.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListBodyDto } from '../dto/list-body.dto';
import { User } from '../decorators/user.decorator';
import { UpdateScriptDto } from './dto/update-script.dto';
import { CreateScriptDto } from './dto/create-script.dto';

@ApiBearerAuth()
@ApiTags('script')
@Controller('script')
export class ScriptController {
    constructor(private readonly scriptService: ScriptService) {
    }

    @ApiOperation({ summary: '创建' })
    @Post()
    creat(@Body() creatScriptDto: CreateScriptDto, @User() user) {
        return this.scriptService.creat(creatScriptDto, user);
    }

    @ApiOperation({ summary: '更新' })
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateScriptDto: UpdateScriptDto, @User() user) {
        return this.scriptService.update(+id, updateScriptDto, user);
    }

    @ApiOperation({ summary: '列表' })
    @Post('list')
    list(@Body() listBody: ListBodyDto, @Request() request) {
        return this.scriptService.list(listBody, request);
    }

    @ApiOperation({ summary: '获取' })
    @Get(':id')
    findOne(@Param('id') id: string, @User() user) {
        return this.scriptService.findOne(+id, user);
    }

    @ApiOperation({ summary: '删除' })
    @Delete(':id')
    remove(@Param('id') id: string, @User() user) {
        return this.scriptService.remove(+id, user);
    }

    @Get('options')
    options(@Query('keyWords') keyWords: string) {
        console.log(keyWords);
        return Promise.resolve({});
    }
}
