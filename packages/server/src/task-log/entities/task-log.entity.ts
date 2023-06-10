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
export class TaskLog {
  @Column('longtext')
  log: string;
  @Column()
  status: number;
  @ManyToOne(() => Task, (task) => task.taskLog, { onDelete: 'CASCADE' })
  task: Task;
  @ManyToOne(() => User, (user) => user.taskLog)
  user: User;
  @PrimaryGeneratedColumn()
  readonly id: number;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  readonly updateTime: Date;
}
