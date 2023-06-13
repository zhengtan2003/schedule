import { Env } from '@/env/entities/env.entity';
import { Log } from '@/log/entities/log.entity';
import { Script } from '@/script/entities/script.entity';
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
  @OneToMany(() => Log, (Log) => Log.task)
  log: Log[];
  @OneToMany(() => Env, (Env) => Env.task)
  env: Env[];
  @ManyToOne(() => User, (user) => user.task)
  user: User;
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  updateTime: Date;
}
