import express from 'express';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/curuser';
import { registrRouter } from './routes/registr';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { errHandler } from '@tk-test-org/tk-test-common';
import { testcookieRouter } from './routes/tstsign';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession( { 
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(registrRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(testcookieRouter);

app.use(errHandler);

export { app };