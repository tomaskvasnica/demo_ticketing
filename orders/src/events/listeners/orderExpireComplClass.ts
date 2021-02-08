import { Listener, ExprtnComplEvt, Topics, OrderStatus } from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';
import {Order} from '../../dbmodels/ordermodel';
import {OrderCancelledPublisher} from '../publishers/orderCancPublish';
export class OrderExpComplLstn extends Listener<ExprtnComplEvt> {
    queueGroupName = 'orders-service';
    topic: Topics.ExpiryComplete = Topics.ExpiryComplete;
    async onMessage(data: ExprtnComplEvt['data'], msg:Message) {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error(' order to be expired not found: ' + data.orderId);
        }

        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }
        
        order.set( {status: OrderStatus.Cancelled});
        await order.save();
        new OrderCancelledPublisher(this.client).publish( {
            id: order.id,
            version: +order.version,
            userId: order.userId,
            status: order.status,
            expiresAt: order.expiresAt.toString(),
            ticket : {id: order.ticket.id, price: order.ticket.price}
        } );
        msg.ack();
    }
}