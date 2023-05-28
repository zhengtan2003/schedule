import {faker} from "@faker-js/faker";
import {Task} from '../task/task.entity';
import {Env} from '../env/env.entity';
import {Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Column, OneToMany} from 'typeorm';

@Entity()
export class User {
    @Column({default: faker.internet.avatar()})
    avatar: string;
    @Column('text')
    email: string;
    @Column({default: faker.person.fullName()})
    name: string;
    @Column('text', {nullable: true})
    phoneNumber: string;
    @Column('text')
    password: string;
    @OneToMany(() => Task, (task) => task.user)
    task: Task[];
    @OneToMany(() => Env, (env) => env.user)
    Env: Env[];
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;

     async comparePassword(password: string): Promise<boolean> {
        return password === this.password;
    }
}
