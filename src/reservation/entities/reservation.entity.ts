import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { ReservedRoom } from './reserved-room.entity';
import { Customer } from '../../customer/entities/customer.entity';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    uuid: string;

    @Column()
    type: string;

    @Column()
    customerId: number;

    @Column()
    customerName: string;

    @ManyToOne(() => Customer, (customer) => customer.reservations)
    customer: Customer;

    @OneToMany(() => ReservedRoom, (room) => room.reservation)
    rooms: ReservedRoom[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
