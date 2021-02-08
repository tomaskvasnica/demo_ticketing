import { Listener } from './listenerClss';
import { Message } from 'node-nats-streaming';
import { TickCreaEvt } from './tickCreaEvt';
import { Topics } from './topics'

export class TicketCreatedListnr extends Listener<TickCreaEvt> {
    onMessage(data: TickCreaEvt['data'], msg: Message): void {
        console.log('event data', data);
        msg.ack();
    };
    topic: Topics.TicketCreated = Topics.TicketCreated;
    queueGroupName = 'payments-service';
};