import mongoose from 'mongoose';
import { app } from './app';
import { errHandler } from '@tk-test-org/tk-test-common';
import { natsWrapper } from './natsWrapper';
import { TicketCreatedListener } from './events/listeners/ticketCreaLstnrClass';
import { TicketUpdatedListener } from './events/listeners/ticketUpdListrClass';
import { OrderExpComplLstn } from './events/listeners/orderExpireComplClass';
import { PaymentCreatedListener } from './events/listeners/paymCreaLstnr';

console.log('process.env.POD_NAME', process.env.POD_NAME);

const start = async () => {
    if (!process.env.JWT_SALT) {
        throw new Error(' JWT_SALT has to be defined, please check / set secret: jwt-secret ');
    }
    if (!process.env.POD_NAME) {
        throw new Error(' POD_NAME env variable has to be specified ');
    }
    try {
        await natsWrapper.wrapConnect('ticketing', process.env.POD_NAME, 'http://nats-svc:4222');

        natsWrapper.client.on('connect', () => {
            console.log('listener connected to nats');

            natsWrapper.client.on('close', () => {
                console.log('NATS connection closed');
                process.exit();
            });

            process.on('SIGINT', () => {
                console.log('about to call SIGINT close');
                natsWrapper.client.close();
            });
            process.on('SIGTERM', () => {
                console.log('about to call SIGTERM close');
                natsWrapper.client.close();
            });
            process.on('SIGKILL', () => {
                console.log('about to call SIGKILL close');
                natsWrapper.client.close();
            });
        });
    } catch (err) {
        console.log(err.toString());
    }

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new OrderExpComplLstn(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect('mongodb://orders-mongo-svc:27017/tickets', {
        useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true
    });

    console.log(' connected to mongo db successfully ');
    app.use(errHandler);

    app.listen(4000, () => {
        console.log('Tickets is listening on 4000 !!!');
    });
};

start();
