import {Listener, OrderCancelledEvent,  OrderStatus,  Topics} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import {Order} from '../../dbmodels/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    topic:Topics.OrderCancelled = Topics.OrderCancelled;
    queueGroupName = 'payment-service';
    async onMessage(data:OrderCancelledEvent['data'], msg:Message) {
        if (!data.version) {
            data.version = 1;
        }
        const order = await Order.findOne({ _id: data.id, version: +data.version-1});
        if (!order)  {
            //console.log('[Paynent orderCancelListener] Order not found ');
            throw new Error('[Paynent orderCancelListener] Order not found ');
        }
        order.set({status: OrderStatus.Cancelled});
        await order.save();
        msg.ack();
    }
}