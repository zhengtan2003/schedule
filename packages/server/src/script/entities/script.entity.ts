import { Task } from '@/task/entities/task.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Script {
  @Column({ nullable: true })
  name: string;
  @Column({ default: 'javascript' })
  language: string;
  @Column()
  filePath: string;
  @Column({ default: 'node' })
  startCommand: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  updateURL: string;
  @Column({ nullable: true })
  version: string;
  @ManyToMany(() => Task, (task) => task.scripts)
  tasks: Task[];
  @ManyToOne(() => User, (user) => user.scripts)
  user: User;
  @PrimaryGeneratedColumn()
  readonly id: number;
  @UpdateDateColumn()
  readonly updateTime: Date;
  @CreateDateColumn()
  readonly createTime: Date;
}
