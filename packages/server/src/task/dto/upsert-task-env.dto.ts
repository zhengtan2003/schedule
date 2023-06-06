import { IsNotEmpty } from 'class-validator';

export class UpsertTaskEnvDto {
    id: string;
    @IsNotEmpty()
    code: string;
    @IsNotEmpty()
    taskId: string;
    remark: string;
}
