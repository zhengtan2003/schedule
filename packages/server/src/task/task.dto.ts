import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskDto {
  @ApiProperty({ example: 'console.log(1)', description: '执行代码' })
  @IsNotEmpty({ message: '请输入代码' })
  code: string;
  @ApiProperty({ example: '任务名称', description: '任务名称' })
  @IsNotEmpty({ message: '请输入名称' })
  name: string;
  @ApiProperty({ example: '任务备注', description: '备注' })
  remark?: string;
  @ApiProperty({ example: '开始时间' })
  startTime?: Date;
  @ApiProperty({ example: '结束时间' })
  endTime?: Date;
  @ApiProperty({ example: '版本' })
  version?: Date;
}
