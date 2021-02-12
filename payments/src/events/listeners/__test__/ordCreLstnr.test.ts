import {natsWrapper} from '../../../natsWrapper';
import {OrderCreatedListener} from '../ordCreaLstnr';
import {OrderCreatedEvent, OrderStatus} from '@tk-test-org/tk-test-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import {Order} from '../../../dbmodels/order';

const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);
    const data: OrderCreatedEvent['data']= {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        expiresAt: 'lala',
        userId: '12345',
        status: OrderStatus.Created,
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
    const order = await Order.findById(data.id);
    expect(order.price).toEqual(data.ticket.price);

});

it(' acks message ', async ()=> {
    const {data, msg, listener} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});