import { Injectable } from '@nestjs/common';
import { CreateEnvDto } from './dto/create-env.dto';
import { UpdateEnvDto } from './dto/update-env.dto';
import { Env } from './entities/env.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpResponse } from '@/http-response';

@Injectable()
export class EnvService {
    constructor(
        @InjectRepository(Env)
        private envRepository: Repository<Env>,
    ) {
    }

    repository() {
        return this.envRepository;
    }

    async create(createEnvDto: CreateEnvDto, user) {
        const { processEnv, taskId } = createEnvDto;
        const env = new Env();
        env.processEnv = processEnv;
        env.task = { id: taskId };
        env.user = user;
        await this.envRepository.save(env);
        return new HttpResponse({ showType: 1 });
    }

    async list({ params }, user) {
        const { current = 1, pageSize = 10, taskId } = params;
        const [data, total] = await this.envRepository.findAndCount({
            where: {
                task: { id: taskId },
                user: user,
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
        const env = await this.envRepository.findOne({ where: { id, user } });
        if (!env) return new HttpResponse({ showType: 1, success: false, message: '未找到ENV' });
        return new HttpResponse({
            data: env,
        });
    }

    async form(id: number, user) {
        const env = await this.envRepository.findOne({ where: { id, user } });
        if (!env) return new HttpResponse({ showType: 1, success: false, message: '未找到ENV' });
        const { processEnv, remark } = env;
        return { processEnv, remark };
    }

    async update(updateEnvDto: UpdateEnvDto, user) {
        const { id, processEnv, remark } = updateEnvDto;
        const env = await this.envRepository.findOne({ where: { id: +id, user } });
        if (!env) return new HttpResponse({ showType: 1, success: false, message: '未找到ENV' });
        env.remark = remark;
        env.processEnv = processEnv;
        await this.envRepository.save(env);
        return new HttpResponse({ showType: 1 });
    }

    async remove(id: number, user) {
        const env = await this.envRepository.findOne({ where: { id, user } });
        if (!env) return new HttpResponse({ showType: 1, success: false, message: '未找到ENV' });
        await this.envRepository.remove(env);
        return new HttpResponse({ showType: 1 });
    }
}
