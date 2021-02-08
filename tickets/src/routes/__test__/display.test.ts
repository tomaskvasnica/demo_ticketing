import request from 'supertest';
import {app} from  '../../app';
// import { Ticket } from '../../dbmodel/ticket';

it('returns 404 if ticket is not found', async () => {
    await request(app).get('/api/tickets/60115e521fae4c32309017d6').send().expect(404);
});

it('returns ticket if found', async () => {
    const resp = await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket', price: 10 }).expect(201);
    //console.log(resp.body.id);
    const tick = await request(app).get(`/api/tickets/${resp.body.id}`).set('Cookie', global.cookie()).send({ title: 'My correct ticket', price: 10 });
    console.log('title, id, price', tick.body.title, tick.body.id, tick.body.price, tick.status);
    expect(tick.status).toEqual(200);
});