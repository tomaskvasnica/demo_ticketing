import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';
import jwt from 'jsonwebtoken';

let mongo:any;

declare global {
    namespace NodeJS {
        interface Global {
            cookie(): string[];
            cookie2(): string[];
        }
    }
}
jest.mock('../natsWrapper');

beforeAll(async () => {
    process.env.JWT_SALT = 'myjwtsalt';
    mongo = new MongoMemoryServer ();
    const mongoURI = await mongo.getUri();
    await mongoose.connect(mongoURI, {
        useNewUrlParser: true, useUnifiedTopology: true
    });
});

beforeEach( async () => {
    const colls = await mongoose.connection.db.collections();
    for (let coll of colls) {
        await coll.deleteMany({});

    }
});

afterAll (async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.cookie = () => {
    //mytestsalt
    const token = jwt.sign( {id: '12345', email:'tom@tom.tom'}, process.env.JWT_SALT!);
    const session = { jwt: token };
    const sessJson = JSON.stringify(session);
    const base64 = Buffer.from(sessJson).toString('base64');
    return ['express:sess=' + base64];
}

global.cookie2 = () => {
    //mytestsalt
    const token = jwt.sign( {id: '54321', email:'tom@tom.tom'}, process.env.JWT_SALT!);
    const session = { jwt: token };
    const sessJson = JSON.stringify(session);
    const base64 = Buffer.from(sessJson).toString('base64');
    return ['express:sess=' + base64];
}