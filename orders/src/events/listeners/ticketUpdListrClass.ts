import {Listener, TickUpdEvt, Topics} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import {Ticket} from '../../dbmodels/ticketmodel';

export class TicketUpdatedListener extends Listener<TickUpdEvt> {
    topic:Topics.TicketUpdated = Topics.TicketUpdated;
    queueGroupName = 'orders-service';
    async onMessage (data: TickUpdEvt['data'], msg:Message) {
        const {title, price} = data;
        //const tick = await Ticket.findById(data.id).exec();
        console.log('ticket:updated listener: ', {id: data.id, title, price});
        const tick = await Ticket.findOne({_id: data.id, version: +data.version-1}).exec();
        if(!tick) {
            throw new Error('[Order: ticket-update listener] Ticket to be updated has not been found ');
        }
        tick.set({title, price});
        await tick.save();
        msg.ack();
    }
}