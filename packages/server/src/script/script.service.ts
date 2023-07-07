import { HttpResponse } from '@/http-response';
import { CreateScriptDto } from '@/script/dto/creat-script.dto';
import {
  readFileSync,
  searchOrder,
  searchParams,
  unlinkSync,
  writeFileSync,
} from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { firstValueFrom } from 'rxjs';
import { OptionsDto } from '@/script/dto/options.dto';
import { UpdateScriptDto } from '@/script/dto/update-script.dto';
import { Script } from '@/script/entities/script.entity';
import { getFilePath, getStartCommand } from '@/script/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ScriptService {
  public repository: Repository<Script>;

  constructor(
    @InjectRepository(Script)
    private scriptRepository: Repository<Script>,
  ) {
    this.repository = this.scriptRepository;
  }

  async findOne(options, skipException = false) {
    const script = await this.scriptRepository.findOne(options);
    if (!script && !skipException) {
      throw new NotFoundException('未找到脚本');
    }
    return script;
  }

  async creat(createScriptDto: CreateScriptDto, user) {
    const filePath = getFilePath(createScriptDto.language, user.id);
    const startCommand = getStartCommand(createScriptDto.language);
    const script = this.scriptRepository.create(createScriptDto);
    script.filePath = filePath;
    script.startCommand = startCommand;
    script.user = user;
    writeFileSync(filePath, createScriptDto.code);
    await this.scriptRepository.save(script);
    return new HttpResponse({ showType: 1 });
  }

  async update(upsertScriptDto: UpdateScriptDto, user) {
    const { id, code, ...restUpsertScriptDto } = upsertScriptDto;
    const script = await this.findOne({ where: { id, user } });
    writeFileSync(script.filePath, code);
    await this.scriptRepository.update({ id, user }, restUpsertScriptDto);
    return new HttpResponse({ showType: 1 });
  }

  async search(searchDto, user) {
    const {
      current = 1,
      pageSize = 10,
      taskId,
      ...retParams
    } = searchDto.params;
    const where = searchParams(retParams);
    const order = searchOrder(searchDto.order);
    const tasks = taskId ? [{ id: taskId }] : undefined;
    const [data, total] = await this.scriptRepository.findAndCount({
      order,
      take: pageSize,
      skip: (current - 1) * pageSize,
      where: { ...where, tasks, user },
    });
    return new HttpResponse({ data, total });
  }

  async remove(id: number, user) {
    const script = await this.findOne({
      where: { id, user },
    });
    unlinkSync(script.filePath);
    await this.scriptRepository.remove(script);
    return new HttpResponse({
      showType: 1,
    });
  }

  // async subscribe(subscribeDto, user) {
  //   const { updateURL } = subscribeDto;
  //   let code = '';
  //   try {
  //     const response = await firstValueFrom(this.httpService.get(updateURL));
  //     code = response.data;
  //   } catch (e) {
  //     return new HttpResponse({
  //       success: false,
  //       showType: 1,
  //       message: `请求失败：${updateURL}`,
  //     });
  //   }
  //   const { userScrip, schemaFormProps } = analysisComment(code);
  //   const fileExt = path.extname(updateURL);
  //   const fileName = path.basename(updateURL, fileExt);
  //   const languageMap = {
  //     '.js': 'javascript',
  //   };
  //   return this.creat(
  //     {
  //       code,
  //       updateURL,
  //       schemaFormProps,
  //       remark: userScrip.remark,
  //       name: userScrip.name ?? fileName,
  //       language: languageMap[fileExt] ?? 'javascript',
  //     },
  //     user,
  //   );
  // }

  async from(id, user) {
    if (!id) return {};
    const script = await this.findOne({ where: { id, user } });
    const code = readFileSync(script.filePath);
    return {
      code,
      name: script.name,
      version: script.version,
      language: script.language,
      updateURL: script.updateURL,
      description: script.description,
    };
  }

  async options(optionsDto: OptionsDto, user) {
    const where = { user };
    if (!isNaN(optionsDto.taskId)) {
      where['tasks'] = [{ id: optionsDto.taskId }];
    }
    const scripts = await this.scriptRepository.findBy(where);
    if (!scripts) return [];
    return scripts.map(({ name, id }) => ({ label: name, value: id }));
  }
}
