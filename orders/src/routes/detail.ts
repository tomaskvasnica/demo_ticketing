import express, {Request, Response} from 'express';
import { requireAuth } from '@tk-test-org/tk-test-common';
import { Order } from '../dbmodels/ordermodel';

const router = express.Router();

router.get('/api/orders/:id', requireAuth, async (req:Request, res:Response) => {
    const ord = await Order.findById(req.params.id).populate('ticket');
    if (!ord) {
        return res.status(404).send({errors: [{message: 'Item not found'}]});
    }
    if (ord.userId !== req.currentUser!.id) {
        return res.status(401).send({errors: [{ message: 'You are not authorized to view this record ' }]});
    }
    res.send(ord);
});

export { router as detailRouter };