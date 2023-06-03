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
    @Column()
    name: string;
    @Column()
    language: string;
    @Column()
    filePath: string;
    @Column({ nullable: true })
    remark: string;
    @Column({ nullable: true })
    updateURL: string;
    @OneToMany(() => Task, (task) => task.script)
    task: { id: any };
    @ManyToOne(() => User, (user) => user.script)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @UpdateDateColumn()
    readonly updateTime: Date;
    @CreateDateColumn()
    readonly createTime: Date;
}
