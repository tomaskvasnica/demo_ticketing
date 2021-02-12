import {natsWrapper} from '../../../natsWrapper';
import {OrderCancelledListener} from '../ordCancLstnr';
import {OrderCancelledEvent, OrderStatus} from '@tk-test-org/tk-test-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {Order} from '../../../dbmodels/order';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({ 
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        version: 0,
        userId: '12345'
    });
    await order.save();

    const data: OrderCancelledEvent['data']= {
        id: order.id,
        version: 1,
        expiresAt: 'lala',
        userId: '12345',
        status: OrderStatus.Cancelled,
        ticket: {
            id: mongoose.Types.ObjectId().toHexString(),
            price: 10
        }
    };

    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    };

    return {data, msg, listener};
};

it(' replicates order info on message', async ()=> {
    const {data, msg, listener} = await setup();
    await listener.onMessage(data, msg);
    const updorder = await Order.findById(data.id);
    expect(updorder.status).toEqual(data.status);

});

it(' acks message ', async ()=> {
    const {data, msg, listener} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});