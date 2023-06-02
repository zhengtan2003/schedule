import { Injectable, NotFoundException } from '@nestjs/common';
import { Script } from './entities/script.entity';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { fileSuffixMap } from './constants';
import { UpdateScriptDto } from './dto/update-script.dto';
import { CreateScriptDto } from './dto/create-script.dto';

@Injectable()
export class ScriptService {
    constructor(
        @InjectRepository(Script)
        private scriptRepository: Repository<Script>,
    ) {
    }

    async creat(creatScriptDto: CreateScriptDto, user) {
        const { name, language, remark, code } = creatScriptDto;
        const script = new Script();
        script.name = name;
        script.remark = remark;
        script.language = language;
        script.user = user;
        script.filePath = path.join(__dirname, 'files', `${user.id}`, language, `${Date.now()}.${fileSuffixMap[language]}`);
        if (!fs.existsSync(script.filePath)) fs.mkdirSync(path.dirname(script.filePath), { recursive: true });
        fs.writeFileSync(script.filePath, code);
        await this.scriptRepository.save(script);
        return {
            showType: 1,
        };
    }

    async update(id: number, updateScriptDto: UpdateScriptDto, user) {
        const { name, language, remark, code } = updateScriptDto;
        const script = await this.scriptRepository.findOne({ where: { id, user } });
        script.name = name;
        script.remark = remark;
        script.language = language;
        await this.scriptRepository.save(script);
        if (fs.existsSync(script.filePath)) fs.writeFileSync(script.filePath, code);
        return {
            showType: 1,
        };
    }

    async list({ params }, { user }) {
        const { current = 1, pageSize = 10 } = params;
        const [data, total] = await this.scriptRepository.findAndCount({
            where: {
                user: { id: user.id },
                // name: params.name,
                // status: params.status
            },
            take: pageSize,
            skip: (current - 1) * pageSize,
        });
        return {
            data,
            total,
        };
    }

    async findOne(id: number, user) {
        const script = await this.scriptRepository.findOne({ where: { id, user } });
        if (!script) throw new NotFoundException();
        const { filePath, createTime, updateTime, ...data } = script;
        const code = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
        return {
            data: {
                ...data,
                code,
            },
        };
    }

    async remove(id: number, user) {
        const script = await this.scriptRepository.findOne({ where: { id, user } });
        if (!script) throw new NotFoundException();
        if (fs.existsSync(script.filePath)) fs.unlinkSync(script.filePath);
        await this.scriptRepository.remove(script);
        return {
            showType: 1,
        };
    }

    async options() {
        // console.log(user);
        // const scripts = await this.scriptRepository.find({ where: { user } });
        // const data = scripts.map(({ name, id }) => ({ label: name, value: id }));
        // return { data };
    }
}
