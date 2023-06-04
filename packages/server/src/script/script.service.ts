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

@Injectable()
export class ScriptService {
    constructor(
        @InjectRepository(Script)
        private scriptRepository: Repository<Script>,
        private httpService: HttpService,
    ) {}

    repository() {
        return this.scriptRepository;
    }

    async creat(creatScriptDto: CreateScriptDto, user) {
        const { name, language, remark, code } = creatScriptDto;
        const script = new Script();
        script.name = name;
        script.remark = remark;
        script.language = language;
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

    async list({ params }, { user }) {
        const { current = 1, pageSize = 10 } = params;
        const [data, total] = await this.scriptRepository.findAndCount({
            where: {
                user: { id: user.id },
            },
            take: pageSize,
            skip: (current - 1) * pageSize,
        });
        return new HttpResponse({
            data,
            total,
        });
    }

    async findOne(id: number, user) {
        const script = await this.scriptRepository.findOne({
            where: { id, user },
        });
        if (!script) throw new NotFoundException();
        const { filePath, createTime, updateTime, ...data } = script;
        const code = fs.existsSync(filePath)
            ? fs.readFileSync(filePath, 'utf8')
            : '';
        return {
            data: {
                ...data,
                code,
            },
        };
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
                    name: metadata.name ?? fileName,
                    language: languageMap[fileExt] ?? 'javascript',
                    code: data,
                    remark: metadata.remark,
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
