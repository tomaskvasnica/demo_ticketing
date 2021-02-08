import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../dbmodels/ticketmodel';
import { natsWrapper } from '../../natsWrapper';
import mongoose from 'mongoose';

it(' marks order as cancelled', async ()=> {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = await Ticket.build({id: mid, title:'test title', price: 10}).save();
    const ord = await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ticketId: tick.id}).expect(201);
    const resp = await request(app).delete(`/api/orders/${ord.body.id}`).set('Cookie', global.cookie()).send();
    expect(resp.body.status).toEqual('cancelled');

} );


it(' returns authorization error if user not logged ', async ()=> {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = await Ticket.build({id:mid, title:'test title', price: 10}).save();
    const ord = await request(app).post('/api/orders').send({ticketId: tick.id}).expect(401);
    //const resp = await request(app).delete(`/api/orders/${ord.body.id}`).set('Cookie', global.cookie()).send();
} );


it(' publishes order cancelled to nats', async ()=> {
    const mid = mongoose.Types.ObjectId().toHexString();
    const tick = await Ticket.build({id:mid, title:'test title', price: 10}).save();
    const ord = await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ticketId: tick.id}).expect(201);
    const resp = await request(app).delete(`/api/orders/${ord.body.id}`).set('Cookie', global.cookie()).send();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
} );