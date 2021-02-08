import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { OrderStatus, requireAuth, validateRequest } from '@tk-test-org/tk-test-common';
import { Order } from '../dbmodels/order';
import { stripe } from '../stripe';
import {Payment} from '../dbmodels/payments';
import { PaymentCreatedPublisher} from '../events/publishers/paymCreaPublisher';
import { natsWrapper } from '../natsWrapper';

const router = express.Router();

router.post('/api/payments', requireAuth, [
    body('token').not().isEmpty(), body('orderId').not().isEmpty()
], validateRequest, async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    console.log(req.body);
    const order = await Order.findById(orderId);
    if (!order) {
        return res.status(404).send({ errors: [{ message: 'oeder for the payment not found' }] });
    }
    if (order.userId !== req.currentUser!.id) {
        return res.status(401).send({ errors: [{ message: ' You are only authorized to pay for your own orders !' }] });
    }
    if (order.status === OrderStatus.Cancelled) {
        return res.status(500).send({ errors: [{ message: ' Order is cancelled already. You are not allowed to pay for it !' }] });
    }
    const charge = await stripe.charges.create({ 
        amount: +order.price * 100,
        currency: 'eur',
        source: token,
        description: order.id});

    const pay = Payment.build({
        orderId,
        stripeId: charge.id
    });
    await pay.save();
    new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: pay.id,
        orderId: order.id,
        stripeId: charge.id
    });
    res.status(201).send({
        id: pay.id,
        orderId: order.id,
        stripeId: charge.id
    });
});

export { router as createChargeRoute }