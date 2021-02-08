import { Listener, Topics, OrderCreatedEvent, OrderCancelledEvent} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import { expQueue } from '../../queues/expirationQueue';

export class OrderCreatedLstnr extends Listener<OrderCreatedEvent> {
    queueGroupName = 'expiration-service';
    topic: Topics.OrderCreated = Topics.OrderCreated;
    async onMessage(data:OrderCreatedEvent['data'], msg:Message) {
        console.log('[expiration] listener received order created event', data);
        const calcDelay =new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log(`[expiration listener] waiting ${calcDelay / 1000} seconds to expire order`);
        await expQueue.add( { orderId: data.id }, { delay: calcDelay });
        msg.ack();
    };
}