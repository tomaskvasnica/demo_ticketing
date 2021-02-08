import {natsWrapper} from  '../../../natsWrapper';
import {OrderCreatedListener} from  '../orderCreaLstnr';
import {Ticket} from '../../../dbmodel/ticket';
import {OrderCreatedEvent, OrderStatus} from '@tk-test-org/tk-test-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const myListener = new OrderCreatedListener(natsWrapper.client);
    const tick = Ticket.build({title: 'fist title', price: 10, userId: '12345'});
    await tick.save();

    //create fake data
    const data:OrderCreatedEvent['data'] = {
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

it(' sets order id for ticket ', async () => {
    const {myListener, tick, data, msg} = await setup();
    await myListener.onMessage(data, msg);
    const myTick = await Ticket.findById(tick.id);
    expect(myTick.orderId).toEqual(data.id);
});

it(' acks the message ', async () => {
    const {myListener, tick, data, msg} = await setup();
    //console.log('tick.id', tick.id);
    await myListener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it(' publishes ticket updated event ', async ()=> {
    const {myListener, tick, data, msg} = await setup();
    await myListener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    //console.log((natsWrapper.client.publish as jest.Mock).mock.calls);
});