import { Env } from '@/env/entities/env.entity';
import { Logger } from '@/logger/entities/logger.entity';
import { Script } from '@/script/entities/script.entity';
import { Task } from '@/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @Column()
  username: string;
  @Column()
  password: string;
  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
  @OneToMany(() => Env, (env) => env.user)
  envs: Env[];
  @OneToMany(() => Logger, (logger) => logger.user)
  loggers: Logger[];
  @OneToMany(() => Script, (script) => script.user)
  scripts: Script[];
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
