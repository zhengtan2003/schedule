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
export class TaskEnv {
  @Column('longtext')
  code: string;
  @Column({ nullable: true })
  description: string;
  @ManyToOne(() => Task, (Task) => Task.taskEnv, { onDelete: 'CASCADE' })
  task: Task;
  @ManyToOne(() => User, (User) => User.taskEnv)
  user: User;
  @PrimaryGeneratedColumn()
  readonly id: number;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  readonly updateTime: Date;
}
