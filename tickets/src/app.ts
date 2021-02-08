import express from 'express';
import { json } from 'body-parser';
import { createTicketRouter } from './routes/newTicket';
import {showTicketRouter} from './routes/ticketDetail';
import {listTicketsRouter} from './routes/listTickets';
import {updateTicketRouter} from './routes/updTicket';


import { errHandler, curUser } from '@tk-test-org/tk-test-common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession( { 
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(listTicketsRouter);
app.use(curUser);

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(updateTicketRouter);

app.use(errHandler);

export { app };