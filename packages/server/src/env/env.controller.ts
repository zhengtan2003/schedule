import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { EnvService } from './env.service';
import { CreateEnvDto } from './dto/create-env.dto';
import { UpdateEnvDto } from './dto/update-env.dto';
import { User } from '@/decorators/user.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ListBodyDto } from '@/dto/list-body.dto';

@ApiBearerAuth()
@ApiTags('env')
@Controller('env')
export class EnvController {
    constructor(private readonly envService: EnvService) {
    }

    @ApiOperation({ summary: '创建' })
    @Post()
    create(@Body() createEnvDto: CreateEnvDto, @User() user) {
        return this.envService.create(createEnvDto, user);
    }

    @ApiOperation({ summary: '列表' })
    @Post('list')
    list(@Body() listBody: ListBodyDto, @User() user) {
        return this.envService.list(listBody, user);
    }


    @Get()
    findOne(@Query('id') id: string, @User() user) {
        return this.envService.findOne(+id, user);
    }

    @Get('form')
    form(@Query('id') id: string, @User() user) {
        return this.envService.form(+id, user);
    }

    @ApiOperation({ summary: '更新' })
    @Patch()
    update(@Body() updateEnvDto: UpdateEnvDto, @User() user) {
        return this.envService.update(updateEnvDto, user);
    }

    @ApiOperation({ summary: '删除' })
    @Delete()
    remove(@Query('id') id: string, @User() user) {
        return this.envService.remove(+id, user);
    }
}
