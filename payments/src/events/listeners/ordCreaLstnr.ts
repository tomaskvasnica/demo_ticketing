import {Listener, OrderCreatedEvent, OrderStatus, Topics} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import {Order} from '../../dbmodels/order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    topic:Topics.OrderCreated = Topics.OrderCreated;
    queueGroupName = 'payment-service';
    async onMessage(data:OrderCreatedEvent['data'], msg:Message) {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            status: data.status,
            price: data.ticket.price,
            version: data.version
        });
        await order.save();
        msg.ack();
    }
}