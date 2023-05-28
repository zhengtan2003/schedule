import {User} from './user.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import type {FindManyOptions} from "typeorm";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async create(userDto) {
        const {email, password} = userDto;
        const user = new User();
        user.email = email;
        user.password = password;
        return await this.userRepository.save(user);
    }

    findOne(where) {
        return this.userRepository.findOne({where})
    }

    find(options?: FindManyOptions<User>) {
        return this.userRepository.find(options)
    }

    async getUser(id) {
        if (!id) throw new UnauthorizedException();
        const data = await this.findOne({id});
        return {
            data,
            success: true
        }
    }
}
