import {Env} from './env.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable, NotFoundException, BadRequestException} from '@nestjs/common';

@Injectable()
export class EnvService {
    constructor(
        @InjectRepository(Env)
        private envRepository: Repository<Env>,
    ) {
    }

    find(where) {
        return this.envRepository.find({where});
    }

    remove(envs) {
        return this.envRepository.remove(envs);
    }

    async upsert(envDto, taskId, {user}) {
        const {id, processEnv, remark} = envDto;
        let env;
        if (!id) {
            env = new Env();
            env.task = {id: taskId}
            env.user = {id: user.id}
        } else {
            env = await this.envRepository.findOne({where: {id, task: {id: taskId}, user: {id: user.id}}});
            if (!env) throw new NotFoundException();
        }
        env.remark = remark;
        env.processEnv = processEnv;
        await this.envRepository.save(env);
        return {
            showType: 1
        }
    }

    async get(id, {user}) {
        const env = await this.envRepository.findOne({where: {id, user: {id: user.id}}});
        if (!env) throw new NotFoundException();
        return {
            data: env
        }
    }

    async delete(id, {user}) {
        const env = await this.envRepository.findOne({where: {id, user: {id: user.id}}});
        if (!env) throw new NotFoundException();
        await this.envRepository.remove(env)
        return {
            showType: 1
        }
    }

    async search({id}, {user}) {
        const data = await this.find({task: {id}});
        // const data = envs.map(({ createTime, updateTime, ...rest }) => rest);
        return {data};
    }
}
