import request from 'supertest';
import {app} from  '../../app';
import { Order, OrderStatus } from '../../dbmodels/ordermodel';
import mongoose from 'mongoose';
import { Ticket } from '../../dbmodels/ticketmodel';
import { natsWrapper} from '../../natsWrapper';


it('returns error if ticket does not exist', async ()=> {
    const tstId = mongoose.Types.ObjectId();
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tstId}).expect(404);
});


it('returns error if ticket is already reserved', async ()=> {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = Ticket.build({
        id:mid, 
        title: 'test ticket',
        price: 20
    });
    await tick.save();
    const ord = Order.build({ userId: 'userid', status: OrderStatus.Created , expiresAt: new Date(), ticket: tick});
    await ord.save();
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id}).expect(500);
});

it('creates an order if all OK', async ()=> {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = Ticket.build({
        id: mid,
        title: 'test ticket',
        price: 40
    });
    await tick.save();
    //const resp = await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id});
    //console.log('test resp: ', resp.body);
    //await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id}).expect(201);
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id}).expect(201);
});

it('returns already reserved (500) for second order on the same ticket', async ()=> {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = Ticket.build({
        id: mid,
        title: 'test ticket',
        price: 40
    });
    await tick.save();
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id}).expect(201);
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id}).expect(500);
});


it('publish event to nats when order create', async () => {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = Ticket.build({
        id: mid,
        title: 'test ticket',
        price: 40
    });
    await tick.save();
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id}).expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});