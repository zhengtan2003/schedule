import { User } from '@/user/entities/user.entity';
import { Task } from '@/task/entities/task.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Script {
    @Column({ nullable: true })
    name: string;
    @Column({ default: 'javascript' })
    language: string;
    @Column()
    filePath: string;
    @Column({ nullable: true })
    description: string;
    @Column({ nullable: true })
    updateURL: string;
    @Column({ nullable: true })
    version: string;
    @OneToMany(() => Task, (task) => task.script)
    task: any;
    @ManyToOne(() => User, (user) => user.script)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @UpdateDateColumn()
    readonly updateTime: Date;
    @CreateDateColumn()
    readonly createTime: Date;
}
