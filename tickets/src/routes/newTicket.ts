import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@tk-test-org/tk-test-common';
import { body } from 'express-validator';
import { Ticket } from '../dbmodel/ticket';
import { TicketCreatedPublish } from '../events/publishers/tickCreaPub';
import {natsWrapper} from '../natsWrapper';

const router = express.Router();

router.post('/api/tickets', requireAuth, [
    body('title').not().isEmpty().withMessage(' Title value was not provided '), 
    body('price').isFloat({ gt: 0 }).withMessage(' Price must be greater than 0 ')

], validateRequest , async (req: Request, res: Response) => {
    console.log('new Ticket req.body: ', req.body);
    const {title, price} = req.body;
    console.log({title, price, userId: req.currentUser!.id});
    const tick = Ticket.build({title, price, userId: req.currentUser!.id});
    await tick.save();
    console.log(tick);
    await new TicketCreatedPublish(natsWrapper.client).publish({id: tick.id, title: tick.title, price: tick.price, userId: tick.userId, version: tick.version})
    res.status(201).send(tick);
});


// router.post('/api/tickets', requireAuth, async (req: Request, res: Response) => {
//     console.log('inside new ticket handler');
//     const {title, price} = req.body;
//     const tick = Ticket.build({title, price, userId: req.currentUser!.id});
//     await tick.save();
//     console.log(tick);
//     await new TicketCreatedPublish(natsWrapper.client).publish({id: tick.id, title: tick.title, price: tick.price, userId: tick.userId})
//     res.status(201).send(tick);
// });

export { router as createTicketRouter};