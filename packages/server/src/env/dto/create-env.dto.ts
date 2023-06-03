import { IsNotEmpty } from 'class-validator';

export class CreateEnvDto {
    @IsNotEmpty()
    processEnv: string;
    @IsNotEmpty()
    taskId: string;
    remark: string;
}
