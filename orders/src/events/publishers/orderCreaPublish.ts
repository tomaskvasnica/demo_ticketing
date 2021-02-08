import { PublisherClss, OrderCreatedEvent, Topics } from '@tk-test-org/tk-test-common';
export class OrderCreatedPublisher extends PublisherClss <OrderCreatedEvent> {
    topic:Topics.OrderCreated = Topics.OrderCreated;
};

//new OrderCreatedPublisher(stan).publish( {id:'123', userId:'123', status:OrderStatus.Created, expiresAt:'123', ticket: { id:'123', price:123}});