import express from 'express';
import { json } from 'body-parser';
// import { displayRouter } from './routes/display';
// import { deleteRouter } from './routes/delete';
// import { detailRouter } from './routes/detail';
// import { newRouter } from './routes/new';
import { deleteRouter } from './routes/delete';
import { detailRouter } from './routes/detail';
import { displayRouter } from './routes/display';
import { newRouter } from './routes/new';

import { errHandler, curUser } from '@tk-test-org/tk-test-common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cookieSession( { 
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
}));
app.use(curUser);
app.use(displayRouter);
app.use(newRouter);
app.use(detailRouter);
app.use(deleteRouter);

app.use(errHandler);

export { app };