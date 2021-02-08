import { Topics } from './topics';

export interface TickCreaEvt {
    topic: Topics.TicketCreated;
    data: {
        id:string;
        title: string;
        price: number;
    };
};