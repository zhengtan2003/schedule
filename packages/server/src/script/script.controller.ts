import { SearchDto } from '@/dto/search.dto';
import { ScriptService } from './script.service';
import { User } from '@/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertScriptDto } from '@/script/dto/script.dto';
import { Controller, Get, Post, Body, Delete, Query } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('script')
@Controller('script')
export class ScriptController {
    constructor(private readonly scriptService: ScriptService) {}

    @ApiOperation({ summary: '创建/更新' })
    @Post()
    upsert(@Body() upsertScriptDto: UpsertScriptDto, @User() user) {
        if (upsertScriptDto.id)
            return this.scriptService.update(upsertScriptDto, user);
        return this.scriptService.creat(upsertScriptDto, user);
    }

    @ApiOperation({ summary: '列表' })
    @Post('search')
    search(@Body() searchDto: SearchDto, @User() user) {
        return this.scriptService.search(searchDto, user);
    }

    @ApiOperation({ summary: '删除' })
    @Delete()
    remove(@Query('id') id: string, @User() user) {
        return this.scriptService.remove(+id, user);
    }

    @ApiOperation({ summary: '订阅' })
    @Post('subscribe')
    subscribe(@Body() subscribeDto, @User() user) {
        return this.scriptService.subscribe(subscribeDto, user);
    }

    @ApiOperation({ summary: '' })
    @Get()
    retrieve(@Query('id') id: string, @User() user) {
        return this.scriptService.retrieve(id, user);
    }

    @ApiOperation({ summary: '' })
    @Get('enum')
    enum(@User() user) {
        return this.scriptService.enum(user);
    }
}
