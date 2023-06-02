import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
    OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Task {
    @Column()
    name: string;
    @Column({ nullable: true })
    startTime: string;
    @Column({ nullable: true })
    endTime: string;
    @Column({ nullable: true, default: 'waiting' })
    status: 'waiting' | 'processing' | 'error';
    @Column({ nullable: true, default: '00 09 * * *' })
    cronTime: string;
    @ManyToOne(() => User, (user) => user.task)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;
}
