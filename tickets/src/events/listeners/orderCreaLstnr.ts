import {Listener, OrderCreatedEvent, Topics} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../dbmodel/ticket';
import { TicketUpdatedPublish } from  '../publishers/tickUpdPub';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    queueGroupName = 'ticket-service';
    topic:Topics.OrderCreated = Topics.OrderCreated;
    async onMessage (data:OrderCreatedEvent['data'], msg:Message) {
        //const tickId = data.ticket.id;
        const tickObj = await Ticket.findById(data.ticket.id);
        if (!tickObj) {
            throw new Error(' [ticket service]/order created listener: ticket with id: ' + data.ticket.id + ' was not found');
        }
        tickObj.set({ orderId: data.id });
        await tickObj.save();
        console.log('about to publish TicketUpdatedPublish', {id: tickObj.id, version: tickObj.version, title: tickObj.title, price:tickObj.price, userId: tickObj.userId, orderId: tickObj.orderId});
        new TicketUpdatedPublish(this.client).publish({id: tickObj.id, version: tickObj.version, title: tickObj.title, price:tickObj.price, userId: tickObj.userId, orderId: tickObj.orderId} );
        msg.ack();
    }
}