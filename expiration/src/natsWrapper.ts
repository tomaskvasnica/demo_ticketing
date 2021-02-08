import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;
    get client() {
        if (!this._client) {
            console.log('natsWrapper - client not initialized yet ');
            throw new Error(' Client was not initiated yet ');
        }
        return this._client;
    }
    wrapConnect (clusterId: string, clientId: string, url: string) {
        console.log('wrap connecting');
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise<void>((resolve, reject)=> {
            this.client.on('connect', ()=>{
                console.log(' nats connected ');
                resolve();
            });
            this.client.on('error', (err)=> {
                console.log('nats wrapper err', err);
                reject();
            });
    
        });
    };
};
export const natsWrapper = new NatsWrapper();