import nats, {Message, Stan} from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListnr } from './events/tickCreaLstnr'

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', ()=> {
    console.log('listener connected to nats');

    stan.on('close', ()=>{
        console.log('NATS connection closed');
        process.exit();
    });

    new TicketCreatedListnr(stan).listen();
});

process.on('SIGINT', ()=> {
    console.log('about to call sigint close');
    stan.close();
});
process.on('SIGTERM', ()=> {
    console.log('about to call sigint close');
    stan.close();
});
process.on('SIGKILL', ()=> {
    console.log('about to call sigint close');
    stan.close();
});
