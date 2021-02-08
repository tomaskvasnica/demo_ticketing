import {ExprtnComplEvt, PublisherClss, Topics} from '@tk-test-org/tk-test-common';

export class ExpirationCompletePublisher extends PublisherClss<ExprtnComplEvt> {
    topic:Topics.ExpiryComplete = Topics.ExpiryComplete;
};