import { OrderStatus } from '@tk-test-org/tk-test-common';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
import mongoose from 'mongoose';

interface OrderAttrs {
    id: string;
    status: OrderStatus;
    version: Number;
    price: Number;
    userId: string;
};

interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    version: Number;
    price: Number;
    userId: string;
};

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    price: {type: Number, required: true},
    userId: {type: String, required: true},
    status: {type: OrderStatus, required: true},
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs)=> {
    return new Order({
        _id: attrs.id,
        version: attrs.version,
        price: attrs.price,
        status: attrs.status,
        userId: attrs.userId
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};