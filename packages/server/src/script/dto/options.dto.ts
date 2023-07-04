import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class OptionsDto {
  @ApiProperty()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  taskId: any;
}
