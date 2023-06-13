import { Log } from '@/log/entities/log.entity';
import { Task } from '@/task/entities/task.entity';
import { User } from '@/user/entities/user.entity';
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
export class Env {
  @Column('longtext')
  code: string;
  @Column({ nullable: true })
  description: string;
  @ManyToOne(() => Task, (Task) => Task.env, { onDelete: 'CASCADE' })
  task: Task;
  @OneToMany(() => Log, (Log) => Log.env)
  log: Log;
  @ManyToOne(() => User, (User) => User.env)
  user: User;
  @PrimaryGeneratedColumn()
  readonly id: number;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  readonly updateTime: Date;
}
