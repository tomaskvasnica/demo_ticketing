import { Listener, OrderCancelledEvent, Topics, TickUpdEvt } from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../dbmodel/ticket';
import { TicketUpdatedPublish } from '../publishers/tickUpdPub';

export class OrderCancListener extends Listener<OrderCancelledEvent> {
    topic: Topics.OrderCancelled = Topics.OrderCancelled;
    queueGroupName = 'ticket-service';
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const tickObj = await Ticket.findById(data.ticket.id);
        if (!tickObj) {
            throw new Error(' [ticket service]/order cancelled listener: ticket with id: ' + data.ticket.id + ' was not found');
        }
        tickObj.set({ orderId: undefined });
        await tickObj.save();
        await new TicketUpdatedPublish(this.client).publish({
            id: tickObj.id,
            version: tickObj.version,
            title: tickObj.title,
            price: tickObj.price,
            userId: tickObj.userId,
            orderId: tickObj.orderId
        });
        msg.ack();
    };
};