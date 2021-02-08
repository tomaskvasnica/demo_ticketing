import { natsWrapper } from './natsWrapper';
import {OrderCreatedLstnr} from './events/listeners/orderCreaLstnr';

console.log('process.env.POD_NAME', process.env.POD_NAME);

const start = async () => {
    if (!process.env.POD_NAME) {
        throw new Error(' POD_NAME env variable has to be specified ');
    }
    try {
        await natsWrapper.wrapConnect('ticketing', process.env.POD_NAME, 'http://nats-svc:4222');

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

        new OrderCreatedLstnr(natsWrapper.client).listen();

    } catch (err) {
        console.error(err);
    };
};

start();
