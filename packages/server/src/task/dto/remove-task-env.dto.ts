import { IsNotEmpty } from 'class-validator';

export class RemoveTaskEnvDto {
    @IsNotEmpty()
    id: string;
    @IsNotEmpty()
    taskId: string;
}
