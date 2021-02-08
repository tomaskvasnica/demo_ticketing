import mongoose from 'mongoose';
import { PassHash } from '../services/pwdhash';

interface MongoUserIF {
    email: string;
    password: string;
};

interface UserModelIF extends mongoose.Model<UserDoc> {
    build(attrs: MongoUserIF): UserDoc;
};

interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
                delete ret.__v;
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await PassHash.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

userSchema.statics.build = (userData: MongoUserIF) => {
    return new User(userData);
};

const User = mongoose.model<UserDoc, UserModelIF>('User', userSchema);

// const buildUser = (userData: MongoUserIF) => {
//     return new User(userData);
// };

export { User };