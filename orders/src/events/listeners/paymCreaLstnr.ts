import { Topics, Listener, PaymentCreatedEvent, OrderStatus } from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import { Order } from '../../dbmodels/ordermodel';
export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    topic: Topics.PaymentCreated = Topics.PaymentCreated;
    queueGroupName = 'orders-service';
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error(' Order not found: ' + data.orderId);
        }
        order.set({ status: OrderStatus.Complete});
        await order.save();
        msg.ack();
    }
}