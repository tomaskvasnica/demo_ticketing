import request from 'supertest';
import {app} from  '../../app';
// import { Ticket } from '../../dbmodel/ticket';

it('can fetch list of tickets', async () => {
    await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket1', price: 10 }).expect(201);
    await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket2', price: 20 }).expect(201);
    await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket3', price: 30 }).expect(201);
    //console.log(resp.body.id);
    const resp = await request(app).get(`/api/tickets`).send().expect(200);
    console.log('title, id, price', resp.body.title, resp.body.id, resp.body.price, resp.status);
    expect(resp.body.length).toEqual(3);
});