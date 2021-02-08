import Queue from 'bull';
import { ExpirationCompletePublisher} from '../events/publishers/expirComplPublisher';
import {natsWrapper} from '../natsWrapper';
interface Payload {
    orderId: string;
}

const expQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expQueue.process(async (job) => {
    console.log(' about to publish expiration complete event', job.data);
    new ExpirationCompletePublisher(natsWrapper.client).publish({ orderId: job.data.orderId });
});

export { expQueue };