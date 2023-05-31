import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Script {
  @Column()
  fileName: string;
  @Column({ nullable: true })
  version: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  updateURL: string;
  @Column()
  filePath: string;
  @ManyToOne(() => User, (user) => user.script)
  user: User;
  @PrimaryGeneratedColumn()
  id: number;
  @UpdateDateColumn()
  updateTime: Date;
  @CreateDateColumn()
  createTime: Date;
}
