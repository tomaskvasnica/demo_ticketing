import {PublisherClss, Topics, PaymentCreatedEvent} from '@tk-test-org/tk-test-common';
export class PaymentCreatedPublisher extends PublisherClss<PaymentCreatedEvent> {
    topic:Topics.PaymentCreated = Topics.PaymentCreated;
}