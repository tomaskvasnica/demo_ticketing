import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFndError } from '@tk-test-org/tk-test-common';
import { body } from 'express-validator';
import { Ticket } from '../dbmodel/ticket';
import {natsWrapper} from '../natsWrapper';
import { TicketUpdatedPublish } from '../events/publishers/tickUpdPub';

const router = express.Router();

// router.put('/api/tickets/:id', async (req: Request, res: Response) => {
//     console.log('inside post');
//     const myTicket = await Ticket.findById(req.params.id).exec();
//     if (!myTicket) {
//         throw new NotFndError();
//     }
//     const {title, price} = req.body;
//     const tick = Ticket.build({title, price, userId: req.currentUser!.id});
//     await tick.save();
//     res.status(201).send(tick);
// });

router.put('/api/tickets/:id', requireAuth, [
    body('title').not().isEmpty().withMessage(' Title value was not provided '), 
    body('price').isFloat({ gt: 0 }).withMessage(' Price must be greater than 0 ')

], validateRequest , async (req: Request, res: Response) => {
    console.log('inside put');
    const myTicket = await Ticket.findById(req.params.id).exec();
    console.log('myTicket1', myTicket);
    if (!myTicket) {
        //throw new NotFndError();
        return res.status(404).send({errors: [{message: 'Item not found'}]});
    }
    if (myTicket.userId !== req.currentUser!.id) {
        console.log('myTicket.userId', myTicket.userId);
        console.log('req.currentUser.id', req.currentUser!.id);
        return res.status(401).send({errors: [{message: 'Only owner can update ticket !'}]});
    }
    if (myTicket.orderId) {
        return res.status(500).send({errors: [{message: 'Ticket is already in the basket and can not be updated !'}]});
    };
    const {title, price} = req.body;
    myTicket.set({ title, price });
    await myTicket.save();
    new TicketUpdatedPublish(natsWrapper.client).publish({id: myTicket.id, title: myTicket.title, price: myTicket.price, userId: myTicket.userId, version: myTicket.version})
    console.log('myTicket2', myTicket);
    // const tick = Ticket.build({title, price, userId: req.currentUser!.id});
    // await tick.save();
    res.status(201).send(myTicket);
});


export { router as updateTicketRouter};