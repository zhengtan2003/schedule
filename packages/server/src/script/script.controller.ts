import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { OptionsDto } from '@/script/dto/options.dto';
import { UpdateScriptDto } from '@/script/dto/update-script.dto';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScriptService } from './script.service';

@ApiBearerAuth()
@ApiTags('script')
@Controller('script')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @ApiOperation({ summary: '创建/更新' })
  @Post()
  upsert(@Body() upsertScriptDto: UpdateScriptDto, @User() user) {
    if ('id' in upsertScriptDto)
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

  // @ApiOperation({ summary: '订阅' })
  // @Post('subscribe')
  // subscribe(@Body() subscribeDto, @User() user) {
  //   return this.scriptService.subscribe(subscribeDto, user);
  // }

  @ApiOperation({ summary: 'from' })
  @Get('from')
  from(@Query('id') id: string, @User() user) {
    return this.scriptService.from(id, user);
  }

  @ApiOperation({ summary: 'options' })
  @Get('options')
  options(@Query() optionsDto: OptionsDto, @User() user) {
    return this.scriptService.options(optionsDto, user);
  }
}
