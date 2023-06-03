import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Task } from '@/task/entities/task.entity';

@Entity()
export class Env {
    @Column()
    processEnv: string;
    @Column({ nullable: true })
    remark: string;
    @ManyToOne(() => Task, (Task) => Task.env)
    task: { id: any };
    @ManyToOne(() => User, (User) => User.env)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
