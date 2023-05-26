import {User} from './user.entity';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {Injectable, UnauthorizedException} from '@nestjs/common';

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

    getUser(id) {
        if (!id) throw new UnauthorizedException();
        return this.findOne({id})
    }
}
