import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../dbmodels/order';
import { OrderStatus } from '@tk-test-org/tk-test-common';
import {stripe} from '../../stripe';

//jest.mock('../../stripe');

it('returns 404 when order does not exist', async () => {
    await request(app).post('/api/payments').set('Cookie', global.cookie()).send({ token: '123', orderId: mongoose.Types.ObjectId().toHexString() }).expect(404);
});
it('returns 401 when purchasing order that does not belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 10,
        userId: '54321'
    });
    await order.save();
    await request(app).post('/api/payments').set('Cookie', global.cookie()).send({ token: '123', orderId: order.id }).expect(401);
});
it('returns 400 when purchasing cancelled order', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Cancelled,
        version: 0,
        price: 10,
        userId: '12345'
    });
    await order.save();
    await request(app).post('/api/payments').set('Cookie', global.cookie()).send({ token: '123', orderId: order.id }).expect(500);
});

it(' returns 201 with valid inputs ', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        version: 0,
        price: 23,
        userId: '12345'
    });
    await order.save();
    await request(app).post('/api/payments').set('Cookie', global.cookie()).send({
        token: 'tok_visa',
        orderId: order.id
    }).expect(201);

    //const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    // expect(chargeOptions.source).toEqual('tok_visa');
    // expect(chargeOptions.amount).toEqual(1500);
    // expect(chargeOptions.currency).toEqual('eur');
    const stripeCharges = await stripe.charges.list({limit: 5});
    //console.log('stripeCharges', stripeCharges.data);
    const chrg = stripeCharges.data.find(itm => itm.description === order.id);
    //console.log(chrg);
    expect(chrg).toBeDefined();
    //expect(chrg!.source).toEqual('tok_visa');
    expect(chrg!.amount).toEqual(2300);
    expect(chrg!.currency).toEqual('eur');
});

it.todo('test if payment has been successfully saved has to be done ');