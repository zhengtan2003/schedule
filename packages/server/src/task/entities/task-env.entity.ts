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
    @Column('longtext')
    code: string;
    @Column({ nullable: true })
    description: string;
    @ManyToOne(() => Task, (Task) => Task.env)
    task: Task;
    @ManyToOne(() => User, (User) => User.env)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
