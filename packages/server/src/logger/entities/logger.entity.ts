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
  @Column('int')
  status: 0 | 1;
  @Column('float')
  executionTime: number;
  @ManyToOne(() => Env, (Env) => Env.logger, { onDelete: 'CASCADE' })
  env: Env;
  @ManyToOne(() => Task, (task) => task.logger, { onDelete: 'CASCADE' })
  task: Task;
  @ManyToOne(() => User, (User) => User.logger, { onDelete: 'CASCADE' })
  user: User;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  readonly updateTime: Date;
}
