import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import {Task} from '../task/task.entity';
import {User} from '../user/user.entity';

@Entity()
export class Env {
    @PrimaryGeneratedColumn()
    id: number;
    @CreateDateColumn()
    createTime: Date;
    @UpdateDateColumn()
    updateTime: Date;
    @Column()
    processEnv: string;
    @Column()
    remark: string;
    @ManyToOne(() => Task, (Task) => Task)
    task: { id: any };
    @ManyToOne(() => User, (User) => User.Env)
    user: { id: any };
}
