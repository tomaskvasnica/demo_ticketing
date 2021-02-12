import request from 'supertest';
import {app} from '../../app';
import { Order, OrderStatus } from '../../dbmodels/ordermodel';
import { Ticket } from '../../dbmodels/ticketmodel';
import mongoose from 'mongoose';

it('fetches orders for current user', async ()=> {
    const tickArr=[];
    let tick = Ticket.build({title: 'tick for user 1', price: 10, id: mongoose.Types.ObjectId().toHexString()});
    tick.save();
    tickArr.push(tick.id);
    tick = Ticket.build({title: 'tick for user 2', price: 20, id: mongoose.Types.ObjectId().toHexString()});
    tick.save();
    tickArr.push(tick.id);
    tick = Ticket.build({title: 'tick for user 2', price: 40, id: mongoose.Types.ObjectId().toHexString()});
    tick.save();
    tickArr.push(tick.id);
    // await Order.build({ userId: '12345', ticket: tickArr[0], expiresAt: new Date(), status: OrderStatus.Created});
    // await Order.build({ userId: '54321', ticket: tickArr[1], expiresAt: new Date(), status: OrderStatus.Created});
    // await Order.build({ userId: '54321', ticket: tickArr[2], expiresAt: new Date(), status: OrderStatus.Created});
    await request(app).post('/api/orders').set('Cookie', global.cookie()).send({ ticketId: tickArr[0]});
    await request(app).post('/api/orders').set('Cookie', global.cookie2()).send({ ticketId: tickArr[1]});
    await request(app).post('/api/orders').set('Cookie', global.cookie2()).send({ ticketId: tickArr[2]});
    const resp1 = await request(app).get('/api/orders').set('Cookie', global.cookie()).send();
    const resp2 = await request(app).get('/api/orders').set('Cookie', global.cookie2()).send();
    console.log('order for user1: ', resp1.body);
    console.log('orders for user2: ', resp2.body);
});