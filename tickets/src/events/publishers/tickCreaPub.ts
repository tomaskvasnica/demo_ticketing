import { PublisherClss, Topics, TickCreaEvt } from '@tk-test-org/tk-test-common';

export class TicketCreatedPublish extends PublisherClss<TickCreaEvt> {
    topic:Topics.TicketCreated = Topics.TicketCreated;
};