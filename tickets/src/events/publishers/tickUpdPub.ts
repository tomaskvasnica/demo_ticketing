import { PublisherClss, Topics, TickUpdEvt } from '@tk-test-org/tk-test-common';

export class TicketUpdatedPublish extends PublisherClss<TickUpdEvt> {
    topic:Topics.TicketUpdated = Topics.TicketUpdated;
};