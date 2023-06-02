import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    create(createUserDto: CreateUserDto) {
        const { email, password } = createUserDto;
        const user = new User();
        user.email = email;
        user.password = password;
        return this.userRepository.save(user);
    }

    findAll() {
        return `This action returns all user`;
    }

    async findOne(id: number) {
        const { password, ...data } = await this.userRepository.findOne({
            where: { id },
        });
        return { data };
    }

    repository() {
        return this.userRepository;
    }

    update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    remove(id: number) {
        return `This action removes a #${id} user`;
    }
}
