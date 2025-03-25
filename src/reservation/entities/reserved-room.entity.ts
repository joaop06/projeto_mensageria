import {
    Column,
    Entity,
    ManyToOne,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

@Entity()
export class ReservedRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    dailyRate: number;

    @Column()
    numberOfDays: number;

    @Column()
    reservationDate: Date;

    @Column()
    categoryId: string;

    @Column()
    subCategoryId: string;

    @ManyToOne(() => Reservation, (reservation) => reservation.rooms)
    reservation: Reservation;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp' })
    deletedAt: Date;
}
