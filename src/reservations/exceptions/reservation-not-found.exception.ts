import { NotFoundException } from "@nestjs/common";

export class ReservationNotFoundException extends NotFoundException {
    constructor() {
        super('Reserva não encontrada');
    }
}