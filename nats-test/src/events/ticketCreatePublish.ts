import { PublisherClss } from './publisherClass';
import { TickCreaEvt } from './tickCreaEvt';
import { Topics } from './topics'

export class tickCreatePublisher  extends PublisherClss<TickCreaEvt> {
    topic:Topics.TicketCreated = Topics.TicketCreated;

}