import { TicketUpdatedListener } from '../ticketUpdListrClass';
import {natsWrapper} from '../../../natsWrapper';
import { TickUpdEvt } from '@tk-test-org/tk-test-common';
import mongoose from 'mongoose';
import { Message, version } from 'node-nats-streaming';
import { Ticket } from '../../../dbmodels/ticketmodel';

const setup = async () => {
    const lstnr = new TicketUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build( {title: 'fst title', price: 10, id: mongoose.Types.ObjectId().toHexString()} );
    await ticket.save();

    const data: TickUpdEvt['data'] = {
        id: ticket.id,
        title: 'my Test Title1',
        userId: '12345',
        price: 12,
        version: +ticket.version + 1
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {lstnr, msg, ticket, data};
};
it(' updates a ticket with a message caught by listener ', async ()=> {
    const {lstnr, msg, ticket, data} = await setup();
    await lstnr.onMessage(data, msg);
    const tick = await Ticket.findById(data.id);
    //expect(Ticket).toBeDefined();
    expect(tick.title).toEqual(data.title);
    expect(tick.price).toEqual(data.price);
});

it(' sends ack to the message ', async ()=> {
    const {lstnr, msg, data} = await setup();
    await lstnr.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});