import mongoose from 'mongoose';
import request from 'supertest';
import {app} from  '../../app';
import { Ticket } from '../../dbmodel/ticket';
// import { Ticket } from '../../dbmodel/ticket';


it('returns 401 if user is not signed in', async ()=> {
    await request(app).put('/api/tickets/60115e521fae4c32309017d6').expect(401);
    //expect(resp.status).not.toEqual(401);
});

it('returns 404 if id does not exist', async ()=> {
    await request(app).put('/api/tickets/60115e521fae4c32309017d6').set('Cookie', global.cookie()).send({title: 'hello', price: 10}).expect(404);
});

it('returns 401 if id does not own ticket', async ()=> {
    const tick = await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket1', price: 10 }).expect(201);
    //console.log('data', tick.data);
    const tickId = tick.body.id;
    //console.log('tickId' , tickId);
    await request(app).put(`/api/tickets/${tickId}`).set('Cookie', global.cookie2()).send({ title: 'My correct ticket2', price: 20 }).expect(401);
});

it('returns 400 if invalid title is provided', async ()=> {
    const tick = await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket1', price: 10 }).expect(201);
    //console.log('data', tick.data);
    const tickId = tick.body.id;
    //console.log('tickId' , tickId);
    await request(app).put(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send({ title: '', price: 20 }).expect(400);
});

it('returns 400 if invalid price is provided', async ()=> {
    const tick = await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket1', price: 10 }).expect(201);
    //console.log('data', tick.data);
    const tickId = tick.body.id;
    //console.log('tickId' , tickId);
    await request(app).put(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send({ title: 'My new ticket' }).expect(400);
});

it('updates a ticket with valid data', async ()=> {
    const tick = await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket1', price: 10 }).expect(201);
    const tickId = tick.body.id;
    let consTick = await request(app).get(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send();
    console.log('consTick1', consTick.body);
    await request(app).put(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send({ title: 'My new ticket', price: 20 }).expect(201);
    const newtick = await request(app).get(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send();
    console.log('consTick2', newtick.body);
    //await request(app).put(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send({ title: 'My new ticket' }).expect(201);
    //expect(newtick.body.)
});

it(' returns an error if ticket is in-progress', async ()=> {
    const tick = Ticket.build({
        title: 'My first title',
        price: 10,
        userId: '12345'
    });
    tick.set( { orderId: mongoose.Types.ObjectId().toHexString() });
    await tick.save();

    await request(app).put(`/api/tickets/${tick.id}`).set('Cookie', global.cookie()).send({ title: 'My new ticket', price: 20 }).expect(500);
    //await request(app).put(`/api/tickets/${tickId}`).set('Cookie', global.cookie()).send({ title: 'My new ticket' }).expect(201);
    //expect(newtick.body.)
    tick.set( { orderId: undefined });
    await tick.save();
    await request(app).put(`/api/tickets/${tick.id}`).set('Cookie', global.cookie()).send({ title: 'My new ticket', price: 20 }).expect(201);
});
