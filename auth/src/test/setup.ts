import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {app} from '../app';

let mongo:any;

declare global {
    namespace NodeJS {
        interface Global {
            signin(mail: string, pwd: string): Promise<string[]>;
        }
    }
}

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

global.signin = async (mail = "tom@tom.tom", pwd ="tom@tom.tom") => {
    const resp = await request(app).post('/api/users/signup').send({ mail, pass: pwd}).expect(201);
    const cookie = resp.get('Set-Cookie');
    return cookie;
}