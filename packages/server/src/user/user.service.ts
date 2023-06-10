import { HttpResponse } from '@/http-response';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username, password } = createUserDto;
    const user = new User();
    user.username = username;
    user.password = password;
    return this.userRepository.save(user);
  }

  async current(user) {
    const { username } = await this.findOne({ where: user });
    return new HttpResponse({
      data: { username },
    });
  }

  async findOne(options, skipException = false) {
    const user = await this.userRepository.findOne(options);
    if (!user && !skipException) {
      throw new NotFoundException('未找到用户');
    }
    return user;
  }

  async find(options) {
    const users = await this.userRepository.find(options);
    return users ?? [];
  }
}
