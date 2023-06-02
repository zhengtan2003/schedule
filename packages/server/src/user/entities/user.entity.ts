import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Task } from '../../task/entities/task.entity';
import { Env } from '../../env/env.entity';
import { Script } from '../../script/entities/script.entity';

@Entity()
export class User {
    @Column()
    email: string;
    @Column()
    password: string;
    @OneToMany(() => Task, (task) => task.user)
    task: Task[];
    @OneToMany(() => Env, (env) => env.user)
    env: Env[];
    @OneToMany(() => Script, (script) => script.user)
    script: Script[];
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
