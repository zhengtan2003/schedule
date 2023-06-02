import { User } from '../../user/entities/user.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Script {
    @Column()
    name: string;
    @Column()
    language: string;
    @Column()
    filePath: string;
    @Column({ nullable: true })
    remark: string;
    @Column({ nullable: true })
    updateURL: string;
    @ManyToOne(() => User, (user) => user.script)
    user: User;
    @PrimaryGeneratedColumn()
    readonly id: number;
    @UpdateDateColumn()
    readonly updateTime: Date;
    @CreateDateColumn()
    readonly createTime: Date;
}
