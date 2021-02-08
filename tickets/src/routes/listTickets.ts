import express, { Request, Response } from 'express';
import { Ticket } from '../dbmodel/ticket';
//import { NotFndError } from '@tk-test-org/tk-test-common'
const router = express.Router();

router.get('/api/tickets', async (req: Request, res:Response) => {
    //console.log('req.params.id', req.params.id);
    const myTick = await Ticket.find({}).exec();
    if(!myTick) {
        return res.status(404).send({errors: [{message: 'Item not found'}]});
    }
    //console.log('myTick', myTick);
    res.status(200).send(myTick);
});

export {router as listTicketsRouter};
