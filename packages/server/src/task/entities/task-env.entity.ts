import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Task } from './task.entity';
import { User } from '@/user/entities/user.entity';

@Entity()
export class TaskEnv {
    @Column()
    filePath: string;
    @Column({ nullable: true })
    remark: string;
    @ManyToOne(() => Task, (Task) => Task.env)
    task: { id: any };
    @ManyToOne(() => User, (User) => User.env)
    user: { id: any };
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
