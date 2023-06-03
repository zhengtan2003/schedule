import { PartialType } from '@nestjs/swagger';
import { CreateEnvDto } from './create-env.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateEnvDto extends PartialType(CreateEnvDto) {
    @IsNotEmpty()
    id: string;
}
