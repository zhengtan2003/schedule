import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    OneToMany,
    // JoinTable,
} from 'typeorm';
// import {Task} from '../task/task.entity';
import {faker} from "@faker-js/faker";

// import { Role } from './role.entity';

@Entity()
export class User {
    @Column({default: faker.internet.avatar()})
    avatar: string;
    @Column('text')
    email: string;
    @Column({default: faker.person.fullName()})
    name: string;
    @Column('text', {nullable: true})
    phoneNumber: string;
    @Column('text')
    password: string;
    // @OneToMany(() => Task, (task) => task.user)
    // task: Task[];
    @PrimaryGeneratedColumn()
    readonly id: number;
    @CreateDateColumn()
    readonly createTime: Date;
    @UpdateDateColumn()
    readonly updateTime: Date;

     async comparePassword(password: string): Promise<boolean> {
        console.log(password)
        return password === this.password;
    }
}
