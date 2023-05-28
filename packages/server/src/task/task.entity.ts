import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne, OneToMany,
} from 'typeorm';
import {User} from '../user/user.entity';
import {Env} from '../env/env.entity';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createTime: Date;
    @UpdateDateColumn()
    updateTime: Date;
    @Column('longtext')
    code: string;
    @Column('text')
    name: string;
    @Column('text', {nullable: true})
    version: string;
    @Column({nullable: true})
    startTime: Date;
    @Column({nullable: true})
    endTime: Date;
    @Column({nullable: true})
    description: string;
    @ManyToOne(() => User, (user) => user.task)
    user: User;
    @OneToMany(() => Env, (env) => env.task)
    env: Env[];
    @Column({nullable: true})
    updateURL: string;
    @Column({nullable: true, default: 'waiting'})
    status: 'waiting' | 'processing' | 'error';
    @Column({nullable: true, default: '00 09 * * *'})
    cronTime: string;
}
