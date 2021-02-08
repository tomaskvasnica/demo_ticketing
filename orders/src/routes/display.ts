import express, {Request, Response} from 'express';
import { requireAuth } from '@tk-test-org/tk-test-common';
import { Order, OrderStatus } from '../dbmodels/ordermodel';


const router = express.Router();

router.get('/api/orders', requireAuth, async (req:Request, res:Response) => {
    const orders = await Order.find({
        userId: req.currentUser!.id
    }).populate('ticket');

    //const orders = await Order.find({ userId: req.currentUser!.id,  status: { $ne: OrderStatus.Cancelled }}).populate('ticket');
    res.send(orders);
});

export { router as displayRouter };