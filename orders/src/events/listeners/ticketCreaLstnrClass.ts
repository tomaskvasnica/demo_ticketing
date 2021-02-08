import {Topics, Listener, TickCreaEvt} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import {Ticket} from '../../dbmodels/ticketmodel';
export class TicketCreatedListener extends Listener<TickCreaEvt> {
    queueGroupName = 'orders-service';
    topic:Topics.TicketCreated = Topics.TicketCreated;
    async onMessage (data: TickCreaEvt['data'], msg: Message) {
        const {id, title, price} = data;
        console.log('ticket:created listener: ', {id, title, price});
        await Ticket.build({ id, title, price}).save();
        msg.ack();
    };
};