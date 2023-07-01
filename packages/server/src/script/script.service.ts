import { HttpResponse } from '@/http-response';
import { CreateScriptDto } from '@/script/dto/creat-script.dto';
import {
  readFileSync,
  searchOptions,
  unlinkSync,
  writeFileSync,
} from '@/utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { firstValueFrom } from 'rxjs';
import { UpdateScriptDto } from '@/script/dto/update-script.dto';
import { Script } from '@/script/entities/script.entity';
import { getFilePath } from '@/script/utils';
import { Repository } from 'typeorm';

@Injectable()
export class ScriptService {
  constructor(
    @InjectRepository(Script)
    private scriptRepository: Repository<Script>,
  ) {}

  async findOne(options, skipException = false) {
    const script = await this.scriptRepository.findOne(options);
    if (!script && !skipException) {
      throw new NotFoundException('未找到脚本');
    }
    return script;
  }

  async creat(createScriptDto: CreateScriptDto, user) {
    const filePath = getFilePath(createScriptDto.language, user.id);
    const script = this.scriptRepository.create(createScriptDto);
    script.filePath = filePath;
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
    const [data, total] = await this.scriptRepository.findAndCount(
      searchOptions(searchDto, { where: { user } }),
    );
    return new HttpResponse({
      data,
      total,
    });
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
      language: script.language,
      updateURL: script.updateURL,
    };
  }

  async select(user) {
    const scripts = await this.scriptRepository.find({ where: { user } });
    if (!scripts) return [];
    return scripts.map(({ name, id }) => ({ label: name, value: id }));
  }
}
