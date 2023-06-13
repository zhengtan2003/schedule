import { User } from '@/decorators/user.decorator';
import { SearchDto } from '@/dto/search.dto';
import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpsertTaskEnvDto } from './dto/env.dto';
import { EnvService } from './env.service';

@ApiBearerAuth()
@ApiTags('env')
@Controller('env')
export class EnvController {
  constructor(private readonly taskEnvService: EnvService) {}

  @ApiOperation({ summary: '创建/更新' })
  @Post()
  upsert(@Body() upsertTaskEnvDto: UpsertTaskEnvDto, @User() user) {
    if (upsertTaskEnvDto.id) {
      return this.taskEnvService.update(upsertTaskEnvDto, user);
    }
    return this.taskEnvService.create(upsertTaskEnvDto, user);
  }

  @ApiOperation({ summary: '删除' })
  @Delete()
  remove(@Query('id') id: string, @User() user) {
    return this.taskEnvService.remove(+id, user);
  }

  @ApiOperation({ summary: '🔍列表' })
  @Post('search')
  search(@Body() searchDto: SearchDto, @User() user) {
    return this.taskEnvService.search(searchDto, user);
  }

  @Get('from')
  form(@Query('id') id: string, @User() user) {
    if (!id) return {};
    return this.taskEnvService.form(+id, user);
  }
}
