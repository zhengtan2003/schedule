import { IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EnvAntdFromQueryDto {
    @ApiProperty()
    @IsOptional()
    id: string;
    @ApiProperty()
    @IsNotEmpty()
    taskId: string;
}
