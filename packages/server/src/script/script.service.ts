import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { fileSuffixMap } from './constants';
import { HttpResponse } from '@/http-response';
import { Script } from './entities/script.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
    searchOptions,
    unlinkSync,
    readFileSync,
    writeFileSync,
} from '@/utils';
import { analysisComment } from '@/utils/analysisComment';

@Injectable()
export class ScriptService {
    constructor(
        @InjectRepository(Script)
        private scriptRepository: Repository<Script>,
        private httpService: HttpService,
    ) {}

    async findOne(options, skipException = false) {
        const script = await this.scriptRepository.findOne(options);
        if (!script && !skipException) {
            throw new NotFoundException('未找到脚本');
        }
        return script;
    }

    async upsert(upsertScriptDto, user) {
        const { id, language, code } = upsertScriptDto;
        const script = !id
            ? new Script()
            : await this.findOne({
                  where: { id, user },
              });
        const filePath = path.join(
            'data',
            'files',
            `${user.id}`,
            language,
            `${Date.now()}`,
            `index.${fileSuffixMap[language]}`,
        );
        const userScrip = analysisComment(code);
        script.user = user;
        script.filePath = filePath;
        script.name = userScrip.name;
        script.version = userScrip.version;
        script.language = userScrip.language;
        script.updateURL = userScrip.updateURL;
        script.description = userScrip.description;
        writeFileSync(script.filePath, code);
        await this.scriptRepository.save(script);
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

    async subscribe(subscribeDto, user) {
        const { updateURL } = subscribeDto;
        let code = '';
        try {
            const response = await firstValueFrom(
                this.httpService.get(updateURL),
            );
            code = response.data;
        } catch (e) {
            return new HttpResponse({
                success: false,
                showType: 1,
                message: `请求失败：${updateURL}`,
            });
        }
        const { userScrip, schemaFormProps } = analysisComment(code);
        const fileExt = path.extname(updateURL);
        const fileName = path.basename(updateURL, fileExt);
        const languageMap = {
            '.js': 'javascript',
        };
        return this.upsert(
            {
                code,
                updateURL,
                schemaFormProps,
                remark: userScrip.remark,
                name: userScrip.name ?? fileName,
                language: languageMap[fileExt] ?? 'javascript',
            },
            user,
        );
    }

    async retrieve(id, user) {
        if (!id) return {};
        const script = await this.findOne({ where: { id, user } });
        const code = readFileSync(script.filePath);
        return {
            code,
            updateURL: script.updateURL,
        };
    }
    async enum(user) {
        const scripts = await this.scriptRepository.find({ where: { user } });
        if (!scripts) return [];
        return scripts.map(({ name, id }) => ({ label: name, value: id }));
    }
}
