import * as fs from 'fs';
import * as path from 'path';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { fileSuffixMap } from './constants';
import { HttpResponse } from '@/http-response';
import { Script } from './entities/script.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateScriptDto } from './dto/update-script.dto';
import { CreateScriptDto } from './dto/create-script.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { searchOptions } from '@/utils';

@Injectable()
export class ScriptService {
    constructor(
        @InjectRepository(Script)
        private scriptRepository: Repository<Script>,
        private httpService: HttpService,
    ) {}

    async creat(creatScriptDto: CreateScriptDto, user) {
        const { name, language, updateURL, remark, code } = creatScriptDto;
        const script = new Script();
        script.name = name;
        script.remark = remark;
        script.language = language;
        script.updateURL = updateURL;
        script.user = user;
        script.filePath = path.join(
            __dirname,
            'files',
            `${user.id}`,
            language,
            `${Date.now()}.${fileSuffixMap[language]}`,
        );
        if (!fs.existsSync(script.filePath))
            fs.mkdirSync(path.dirname(script.filePath), { recursive: true });
        fs.writeFileSync(script.filePath, code);
        await this.scriptRepository.save(script);
        return new HttpResponse({ showType: 1 });
    }

    async update(id: number, updateScriptDto: UpdateScriptDto, user) {
        const { name, language, remark, code } = updateScriptDto;
        const script = await this.scriptRepository.findOne({
            where: { id, user },
        });
        script.name = name;
        script.remark = remark;
        script.language = language;
        await this.scriptRepository.save(script);
        if (!fs.existsSync(script.filePath))
            fs.mkdirSync(path.dirname(script.filePath), { recursive: true });
        fs.writeFileSync(script.filePath, code);
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

    readFile(filePath: string) {
        if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf8');
    }

    async retrieve(id, user) {
        const script = await this.findOne({ where: { id, user } });
        return {
            data: {
                name: script.name,
                remark: script.remark,
                language: script.language,
                updateURL: script.updateURL,
                code: this.readFile(script.filePath),
            },
        };
    }

    async findOne(options, skipException = false) {
        const script = await this.scriptRepository.findOne(options);
        if (!script && !skipException) {
            throw new NotFoundException('未找到脚本');
        }
        return script;
    }

    async remove(id: number, user) {
        const script = await this.scriptRepository.findOne({
            where: { id, user },
        });
        if (!script) throw new NotFoundException();
        if (fs.existsSync(script.filePath)) fs.unlinkSync(script.filePath);
        await this.scriptRepository.remove(script);
        return new HttpResponse({
            showType: 1,
        });
    }

    async select(user) {
        const scripts = await this.scriptRepository.find({ where: { user } });
        if (!scripts) return [];
        return scripts.map(({ name, id }) => ({ label: name, value: id }));
    }

    async subscribe(subscribeDto, user) {
        const { updateURL } = subscribeDto;
        try {
            const { data } = await firstValueFrom(
                this.httpService.get(updateURL),
            );
            const metadata: any = {};
            for (const match of data.matchAll(/\/\/\s*@(\w+)\s+(.*)/g)) {
                const [, key, value] = match;
                metadata[key] = value;
            }
            const fileExt = path.extname(updateURL);
            const fileName = path.basename(updateURL, fileExt);
            const languageMap = {
                '.js': 'javascript',
            };
            return this.creat(
                {
                    updateURL,
                    code: data,
                    remark: metadata.remark,
                    name: metadata.name ?? fileName,
                    language: languageMap[fileExt] ?? 'javascript',
                },
                user,
            );
        } catch (e) {
            return new HttpResponse({
                success: false,
                showType: 1,
                message: `请求失败：${updateURL}`,
            });
        }
    }
}
