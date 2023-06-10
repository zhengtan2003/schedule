import { Script } from '@/script/entities/script.entity';
import { TaskEnv } from '@/task-env/entities/task-env.entity';
import { TaskLog } from '@/task-log/entities/task-log.entity';
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
export class Task {
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  startTime: string;
  @Column({ nullable: true })
  endTime: string;
  @Column('datetime', { nullable: true })
  nextExecutionTime: Date;
  @Column({ nullable: true, default: 1 })
  status: 0 | 1 | 2;
  @Column({ nullable: true, default: '0 7 * * *' })
  cronTime: string;
  @Column({ nullable: true })
  cronName: string;
  @ManyToOne(() => Script, (script) => script.task)
  script: Script;
  @OneToMany(() => TaskLog, (taskLog) => taskLog.task)
  taskLog: TaskLog[];
  @OneToMany(() => TaskEnv, (taskEnv) => taskEnv.task)
  taskEnv: TaskEnv[];
  @ManyToOne(() => User, (user) => user.task)
  user: User;
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  updateTime: Date;
}
