import express from 'express';
import { json } from 'body-parser';

import { errHandler, curUser } from '@tk-test-org/tk-test-common';
import cookieSession from 'cookie-session';
import {createChargeRoute} from './routes/new';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession( { 
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(curUser);

app.use(createChargeRoute);
//app.use();

app.use(errHandler);

export { app };