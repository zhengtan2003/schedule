import { Env } from '@/env/entities/env.entity';
import { Logger } from '@/logger/entities/logger.entity';
import { Script } from '@/script/entities/script.entity';
import { User } from '@/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true, default: 0 })
  status: 0 | 1;
  @Column('json', { nullable: true })
  scriptsExt: Record<
    string,
    { id: number; cronTime: string; cronName: string }
  >;
  @ManyToMany(() => Script, (script) => script.tasks)
  @JoinTable()
  scripts: Script[];
  @OneToMany(() => Logger, (Logger) => Logger.task)
  loggers: Logger[];
  @OneToMany(() => Env, (Env) => Env.task)
  envs: Env[];
  @ManyToOne(() => User, (user) => user.tasks)
  user: User;
  @PrimaryGeneratedColumn()
  id: number;
  @CreateDateColumn()
  readonly createTime: Date;
  @UpdateDateColumn()
  updateTime: Date;
}
