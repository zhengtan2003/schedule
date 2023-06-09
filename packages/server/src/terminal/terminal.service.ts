import { Injectable } from '@nestjs/common';
import { CreateTerminalDto } from './dto/create-terminal.dto';
import { UpdateTerminalDto } from './dto/update-terminal.dto';

@Injectable()
export class TerminalService {
    create(createTerminalDto: CreateTerminalDto) {
        return 'This action adds a new terminal';
    }

    findAll() {
        return `This action returns all terminal`;
    }

    findOne(id: number) {
        return `This action returns a #${id} terminal`;
    }

    update(id: number, updateTerminalDto: UpdateTerminalDto) {
        return `This action updates a #${id} terminal`;
    }

    remove(id: number) {
        return `This action removes a #${id} terminal`;
    }
}
