import { TicketCreatedListener } from '../ticketCreaLstnrClass';
import {natsWrapper} from '../../../natsWrapper';
import { TickCreaEvt } from '@tk-test-org/tk-test-common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../dbmodels/ticketmodel';

const setup = async () => {
    const lstnr = new TicketCreatedListener(natsWrapper.client);
    const data: TickCreaEvt['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'my Test Title1',
        userId: '12345',
        price: 12
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {lstnr, data, msg};
};
it(' creates and saves a ticket ', async ()=> {
    const {lstnr, data, msg} = await setup();
    await lstnr.onMessage(data, msg);
    const tick = await Ticket.findById(data.id);
    expect(Ticket).toBeDefined();
    expect(tick.title).toEqual(data.title);
    expect(tick.price).toEqual(data.price);
});

it(' sends ack to the message ', async ()=> {
    const {lstnr, data, msg} = await setup();
    await lstnr.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});