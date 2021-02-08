import { PublisherClss, OrderCancelledEvent, Topics } from '@tk-test-org/tk-test-common';
export class OrderCancelledPublisher extends PublisherClss <OrderCancelledEvent> {
    topic:Topics.OrderCancelled = Topics.OrderCancelled;
};

//new OrderCancelledPublisher(stan).publish( {id:'123', userId:'123', status:OrderStatus.Created, expiresAt:'123', ticket: { id:'123', price:123}});