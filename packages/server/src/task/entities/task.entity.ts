import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Script } from '@/script/entities/script.entity';
import { TaskEnv } from '@/task/entities/task-env.entity';
import { TaskLog } from './task-log.entity';

@Entity()
export class Task {
    @Column()
    name: string;
    @Column({ nullable: true })
    startTime: string;
    @Column({ nullable: true })
    endTime: string;
    @Column({ nullable: true, default: 1 })
    status: 0 | 1 | 2;
    @Column({ nullable: true, default: '00 09 * * *' })
    cronTime: string;
    @Column({ nullable: true })
    cronName: string;
    @ManyToOne(() => Script, (script) => script.task)
    script: { id: string };
    @OneToMany(() => TaskLog, (taskLog) => taskLog.task)
    log: TaskLog[];
    @OneToMany(() => TaskEnv, (taskEnv) => taskEnv.task)
    env: TaskEnv[];
    @ManyToOne(() => User, (user) => user.task)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
