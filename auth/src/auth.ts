import mongoose from 'mongoose';
import { app } from './app';
import { errHandler } from '@tk-test-org/tk-test-common';
const start = async () => {
    console.log('starting auth service up');
    if (!process.env.JWT_SALT) {
        throw new Error(' JWT_SALT has to be defined, please check / set secret: jwt-secret ');
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-svc:27017/auth', {
            useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true
        })
    } catch (err) {
        console.log(err.toString());
    }
    console.log(' connected to mongo db successfully ');
    app.use(errHandler);
    
    app.listen(4000, ()=> {
        console.log('Auth is listening on 4000 !!!');
    });
};

start();
