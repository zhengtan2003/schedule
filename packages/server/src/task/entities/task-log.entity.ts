import { Task } from './task.entity';
import { TaskEnv } from '@/task/entities/task-env.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';

@Entity()
export class TaskLog {
    @Column('longtext')
    log: string;
    @Column()
    status: number;
    @Column({ nullable: true })
    type: string;
    @ManyToOne(() => Task, (task) => task.log)
    task: { id: any };
    @OneToMany(() => TaskEnv, (taskEnv) => taskEnv.task)
    env: TaskEnv;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
