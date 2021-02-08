import nats from 'node-nats-streaming';
import { tickCreatePublisher } from './events/ticketCreatePublish';

console.clear();
const stan = nats.connect('ticketing', 'abc', {
    url: 'http://localhost:4222'
});

console.log('inside publisher - after connect');

stan.on('connect', async () => {
    console.log('connected');
    const data = {
        id: '123', title: 'helloTitle', price: 20
    };
    //stan.publish('ticket:created', data, ()=> { console.log('event published:', data); });
    const pblshr = new tickCreatePublisher(stan);
    try {
        await pblshr.publish(data);
    } catch (err) {
        console.log(err);
    }

});

// () => {
//     console.log('publisher connected to NATS');
// }