import { Env } from '@/env/entities/env.entity';
import { Task } from '@/task/entities/task.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Logger {
  @PrimaryGeneratedColumn()
  readonly id: number;
  @Column('longtext')
  log: string;
  @Column('float')
  executionTime: number;
  @ManyToOne(() => Env, (env) => env.logger, { onDelete: 'CASCADE' })
  env: Env;
  @ManyToOne(() => Task, (task) => task.loggers, { onDelete: 'CASCADE' })
  task: Task;
  @ManyToOne(() => User, (user) => user.loggers, { onDelete: 'CASCADE' })
  user: User;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  readonly updateTime: Date;
}
