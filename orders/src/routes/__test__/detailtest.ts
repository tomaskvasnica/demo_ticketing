import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import { Ticket } from '../../dbmodels/ticketmodel';

it('fetches order with given id', async ()=> {
    let tick = Ticket.build({title: 'tick for user 1', price: 10, id: mongoose.Types.ObjectId().toHexString()});
    tick.save();
    const resp = await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id});
    //console.log('Order Id', resp.body.id );
    await request(app).get(`/api/orders/${resp.body.id}`).set('Cookie', global.cookie()).send().expect(200); 
});

it('return unauthorized when different user id', async ()=> {
    let tick = Ticket.build({title: 'tick for user 1', price: 10, id: mongoose.Types.ObjectId().toHexString()});
    tick.save();
    const resp = await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tick.id});
    //console.log('Order Id', resp.body.id );
    await request(app).get(`/api/orders/${resp.body.id}`).set('Cookie', global.cookie2()).send().expect(401); 
});

it('return unauthorized when different user id', async ()=> {
    const fakeId = mongoose.Types.ObjectId();
    await request(app).get(`/api/orders/${fakeId}`).set('Cookie', global.cookie2()).send().expect(404); 
});