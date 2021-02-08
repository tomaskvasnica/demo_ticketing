import mongoose from 'mongoose';
import { OrderStatus } from '@tk-test-org/tk-test-common';
import { TicketDoc } from './ticketmodel';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
};

interface OrderDoc extends mongoose.Document {
    userId: string;
    version: number;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
};
interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    status: { type: String, required: true },
    expiresAt: { type: mongoose.Schema.Types.Date, required: true },
    ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('verionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);


orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);
export { OrderStatus };
export { Order };