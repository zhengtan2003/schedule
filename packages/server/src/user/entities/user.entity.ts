import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Task } from '@/task/entities/task.entity';
import { TaskEnv } from '@/task/entities/task-env.entity';
import { Script } from '@/script/entities/script.entity';

@Entity()
export class User {
    @Column()
    username: string;
    @Column()
    password: string;
    @OneToMany(() => Task, (task) => task.user)
    task: Task[];
    @OneToMany(() => TaskEnv, (taskEnv) => taskEnv.user)
    env: TaskEnv[];
    @OneToMany(() => Script, (script) => script.user)
    script: Script[];
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;

    async comparePassword(password: string): Promise<boolean> {
        return password === this.password;
    }
}
