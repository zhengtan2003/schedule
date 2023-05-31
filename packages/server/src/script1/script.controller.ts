import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Body, Post, Request } from "@nestjs/common";
import { ScriptService } from './script.service';
import { AnalysisDto } from './dto/analysis.dto';
import { UpsertDto } from './dto/upsert.dto';
import {BaseController} from '../base/base.controller'

@ApiTags('script')
@Controller('script')
export class ScriptController extends BaseController {
  constructor(private service: ScriptService) {}

  @ApiOperation({ summary: '解析', operationId: 'script_analysis' })
  @ApiBearerAuth()
  @Post('analysis')
  analysis(@Body() body: AnalysisDto) {
    return this.service.analysis(body);
  }

  // @ApiOperation({ summary: '编辑/更新', operationId: 'script_upsert' })
  // @ApiBearerAuth()
  // @Post('upsert')
  // upsert(@Body() body: UpsertDto) {
  //   return this.scriptService.upsert(body);
  // }
  // @ApiOperation({summary: '列表', operationId: 'script_list'})
  // @ApiBearerAuth()
  // @Post('list')
  // search(@Body() body, @Request() request) {
  //   return this.scriptService.list(body, request);
  // }
}
