import { Task } from './task.entity';
import { Env } from '@/env/entities/env.entity';
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
    @ManyToOne(() => Task, (task) => task.log)
    task: { id: any };
    @OneToMany(() => Env, (env) => env.task)
    env: Env;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
