import express, {Request, Response} from 'express';
const router = express.Router();
import { requireAuth, validateRequest, OrderStatus } from '@tk-test-org/tk-test-common';
import { body } from 'express-validator';
import { Ticket } from '../dbmodels/ticketmodel';
import { Order } from '../dbmodels/ordermodel';
//import { Order } from '../dbmodels/ordermodel';
import { natsWrapper } from '../natsWrapper';
import {OrderCreatedPublisher} from '../events/publishers/orderCreaPublish';

const EXPIRE_SECS = 3 * 60;

router.post('/api/orders', requireAuth, [
    body('ticketId').not().isEmpty().withMessage(' [Orders.new] To create an order, ticket id must not be empty ')
    // body('ticketId').isMongoId().withMessage('[Orders.new] ticket id is not of type mongo id');
], validateRequest ,async (req:Request, res:Response) => {
    //find ticket
    const {ticketId} = req.body;
    const ticketFnd = await Ticket.findById(ticketId).exec();
    if (!ticketFnd) {
        return res.status(404).send({errors: [{message: 'Item not found'}]});
        //throw new NotFndError();
    }
    //check if ticket is not reserved already (so if order does not have ticket assigned)
    
    const reserved = await ticketFnd.isReserved();
    if (reserved) {
        return res.status(500).send({errors: [{message: 'Ticket is already reserved'}]});
    };

    //calc expiration
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRE_SECS);
    //build and save order
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticketFnd
    });
    await order.save();

    //publish event to nats
    new OrderCreatedPublisher(natsWrapper.client).publish( 
        {id: order.id, version:order.version, userId:order.userId, status:OrderStatus.Created, expiresAt: order.expiresAt.toISOString(), ticket: { 
            id: ticketFnd.id, price: ticketFnd.price}
     });

    return res.status(201).send(order);
});

export { router as newRouter };