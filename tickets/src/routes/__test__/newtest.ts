import request from 'supertest';
import {app} from  '../../app';
import { Ticket } from '../../dbmodel/ticket';

it('has a route handler listening on /api/tickets for post requests', async ()=> {
    const resp = await request(app).post('/api/tickets').send({});
    expect(resp.status).not.toEqual(404);
    // await request(app).post('/api/users/signin').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(500);
});

it('can not be accessed if user is not signed in', async ()=> {
    const resp = await request(app).post('/api/tickets').expect(401);
    //expect(resp.status).not.toEqual(401);
});

it('can  be accessed if user is signed in', async ()=> {
    const cookie = global.cookie();
    await request(app).get('/api/tickets').set('Cookie', cookie).send({}).expect(200);
});

// it('returns error if invali title is provided', async ()=> {
//     await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({}).expect(200);
// });

it('returns error if invali title is provided', async ()=> {
    await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({
        title: '',
        price: 10
    }).expect(400);
});

it('returns error if invali price is provided', async ()=> {
    await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({
        title: 'myTicket title',
        price: -10
    }).expect(400);

    await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({
        title: 'myTicket title'
    }).expect(400);
});


it('creates a ticket with valid data', async ()=> {
    //check records num in a coolection
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    const resp = await request(app).post('/api/tickets').set('Cookie', global.cookie()).send({ title: 'My correct ticket', price: 10 }).expect(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
});
