import { Stan } from 'node-nats-streaming';
import { Topics } from './topics';

interface Event {
    topic: Topics;
    data: any;
}

export abstract class PublisherClss<T extends Event> {
    abstract topic: T['topic'];
    private client: Stan;
    constructor(client: Stan) {
        this.client = client;
    };

    publish(data: T['data']):Promise<void> {
        return new Promise((resolve, reject) => {
            this.client.publish(this.topic, JSON.stringify(data), (err) => {
                if (err) {
                    return reject(err);
                }
                console.log(`published to topic ${this.topic}, data: ${JSON.stringify(data)}`);
                resolve();
            })
        });

    }
};