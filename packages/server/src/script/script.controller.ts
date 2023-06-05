import { SearchDto } from '@/dto/search.dto';
import { ScriptService } from './script.service';
import { User } from '@/decorators/user.decorator';
import { UpdateScriptDto } from './dto/update-script.dto';
import { CreateScriptDto } from './dto/create-script.dto';
import { SubscribeDto } from '@/script/dto/subscribe.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Query,
} from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('script')
@Controller('script')
export class ScriptController {
    constructor(private readonly scriptService: ScriptService) {}

    @ApiOperation({ summary: '创建' })
    @Post()
    creat(@Body() creatScriptDto: CreateScriptDto, @User() user) {
        return this.scriptService.creat(creatScriptDto, user);
    }

    @ApiOperation({ summary: '更新' })
    @Patch()
    update(
        @Query('id') id: string,
        @Body() updateScriptDto: UpdateScriptDto,
        @User() user,
    ) {
        return this.scriptService.update(+id, updateScriptDto, user);
    }

    @ApiOperation({ summary: '列表' })
    @Post('search')
    search(@Body() searchDto: SearchDto, @User() user) {
        return this.scriptService.search(searchDto, user);
    }

    @ApiOperation({ summary: '获取' })
    @Get()
    retrieve(@Query('id') id: string, @User() user) {
        return this.scriptService.retrieve(+id, user);
    }

    @ApiOperation({ summary: 'list-用于antd select' })
    @Get('select')
    select(@User() user) {
        return this.scriptService.select(user);
    }

    @ApiOperation({ summary: '删除' })
    @Delete()
    remove(@Query('id') id: string, @User() user) {
        return this.scriptService.remove(+id, user);
    }

    @ApiOperation({ summary: '订阅' })
    @Post('subscribe')
    subscribe(@Body() subscribeDto: SubscribeDto, @User() user) {
        return this.scriptService.subscribe(subscribeDto, user);
    }
}
