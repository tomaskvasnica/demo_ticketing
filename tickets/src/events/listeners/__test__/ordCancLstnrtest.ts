import {natsWrapper} from  '../../../natsWrapper';
import {OrderCancListener} from  '../../listeners/orderCancLstnr';
import {Ticket} from '../../../dbmodel/ticket';
import {OrderCancelledEvent, OrderStatus} from '@tk-test-org/tk-test-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const myListener = new OrderCancListener(natsWrapper.client);
    const tick = Ticket.build({title: 'fist title', price: 10, userId: '12345'});
    tick.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await tick.save();

    //create fake data
    const data:OrderCancelledEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        userId: '12345',
        status: OrderStatus.Created,
        expiresAt: 'timestamp',
        ticket: {
            id: tick.id,
            price: tick.price
        }
    };

    // @ts-ignore
    const msg:Message = {
        ack: jest.fn()
    };

    return {myListener, tick, data, msg};
};

it(' updates ticket, publishes update and acks nats message  ', async () => {
    const {myListener, tick, data, msg} = await setup();
    await myListener.onMessage(data, msg);
    const myTick = await Ticket.findById(tick.id);
    //expect(myTick.orderId).toEqual(undefined);
    expect(myTick.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});