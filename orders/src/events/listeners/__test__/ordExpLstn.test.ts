import { natsWrapper } from '../../../natsWrapper';
import {OrderExpComplLstn} from '../orderExpireComplClass';
import {Order} from '../../../dbmodels/ordermodel';
import {Ticket} from '../../../dbmodels/ticketmodel';
import mongoose from 'mongoose';
import {OrderStatus, ExprtnComplEvt, Topics} from '@tk-test-org/tk-test-common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const myLstnr = new OrderExpComplLstn(natsWrapper.client);
    const ticket = Ticket.build({
        title: 'my test ticket',
        price: 12,
        id: mongoose.Types.ObjectId().toHexString()
    });

    await ticket.save();

    const order = Order.build( { 
        userId: '12345',
        status: OrderStatus.Created,
        expiresAt: new Date(),
        ticket
    } );
    await order.save();

    const data:ExprtnComplEvt['data'] = {
        orderId: order.id
    };

    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    };
    return { myLstnr, data, msg, order, ticket};
};

it(' updates order status to cancelled ', async() => {
    const {myLstnr, data, msg, order, ticket} = await setup();
    await myLstnr.onMessage(data, msg);
    const updOrder = await Order.findById(data.orderId);
    expect(updOrder.status).toEqual(OrderStatus.Cancelled);
});

it(' emits order cancelled message ', async() => {
    const {myLstnr, data, msg, order, ticket} = await setup();
    await myLstnr.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    //console.log((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    const evtData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1] );
    expect(evtData.id).toEqual(order.id);
});

it(' acks the message ', async() => {
    const {myLstnr, data, msg, order, ticket} = await setup();
    await myLstnr.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});