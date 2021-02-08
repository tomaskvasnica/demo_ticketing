import {Message, Stan} from 'node-nats-streaming';
import { Topics} from  './topics'

interface Event {
    topic: Topics;
    data: any;
}
export abstract class Listener<T extends Event> {
    abstract topic: T['topic'];
    abstract queueGroupName: string;
    abstract onMessage (data: T['data'], msg:Message): void;
    private client:Stan;
    protected ackWait = 5000;
    
    constructor (client:Stan) {
        this.client = client;
    }

    subscriptionOpts () {
        return this.client.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setAckWait(this.ackWait).setDurableName(this.queueGroupName);
    }

    listen () {
        const subscr = this.client.subscribe(this.topic, this.queueGroupName, this.subscriptionOpts());
        subscr.on('message', (msg)=> {
            console.log(`message was received by listener ${this.queueGroupName}/ ${msg.body}`);
            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        });
    };
    
    parseMessage (msg: Message) {
        const data = msg.getData();
        return typeof data==='string'? JSON.parse(data) : JSON.parse(data.toString('utf-8'));
    };
};