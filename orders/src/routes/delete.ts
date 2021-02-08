import express, {Request, Response} from 'express';
import {requireAuth} from '@tk-test-org/tk-test-common';
import { Order, OrderStatus } from '../dbmodels/ordermodel';
import { OrderCancelledPublisher } from '../events/publishers/orderCancPublish';
import { natsWrapper } from '../natsWrapper';
const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req:Request, res:Response) => {
    const ord = await Order.findById(req.params.id).populate('ticket');
    if (!ord) {
        return res.status(404).send({errors: [{message: 'Item not found'}]});
    }
    if (ord.userId !== req.currentUser!.id) {
        return res.status(401).send({errors: [{ message: 'You are not authorized to delete this record ' }]});
    }
    ord.status = OrderStatus.Cancelled;
    ord.save();
    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: ord.id, version: ord.version, userId:ord.userId, status: OrderStatus.Cancelled, expiresAt: ord.expiresAt.toISOString() , ticket: 
            { id: ord.ticket.id, price: ord.ticket.price}
        }
    )
    res.send(ord);
});

export { router as deleteRouter };