import mongoose from 'mongoose';
import {Order, OrderStatus} from './ordermodel';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface TicketAttrs {
    title: string;
    price: number;
    id: string
    // version: number;
};
 
export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
};

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs):TicketDoc;
}

const ticketSchema = new mongoose.Schema<TicketDoc>( { 
    title: {type: String, required: true},
    price: {type: Number, required: true, min: 0},
 }, {
     toJSON: {
         transform(doc, ret) {
             ret.id = ret._id;
             delete ret._id;
        }
     }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
};

ticketSchema.methods.isReserved = async function () {
    const resOrder = await Order.findOne({ ticket: this, status: { $ne: OrderStatus.Cancelled }});
    return !!resOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };