import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../users/user.entity.js';

@Entity()
export class Record {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  @Column({ type: 'integer' })
  userId: number;

  // @ManyToOne(() => User, (user) => user.records) // Establishing the many-to-one relationship
  // @JoinColumn({ name: 'userId' }) // Specifying the join column
  // user: User;

  @Column({ type: 'integer' })
  categoryId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'integer' })
  amount: number;
}
