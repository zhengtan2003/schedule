import { Script } from '@/script/entities/script.entity';
import { TaskEnv } from '@/task-env/entities/task-env.entity';
import { TaskLog } from '@/task-log/entities/task-log.entity';
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
  task: Task[];
  @OneToMany(() => TaskEnv, (taskEnv) => taskEnv.user)
  taskEnv: TaskEnv[];
  @OneToMany(() => TaskLog, (taskLog) => taskLog.user)
  taskLog: TaskLog[];
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
