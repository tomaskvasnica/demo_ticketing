import request from 'supertest';
import {app} from  '../../app';

it('responds with current user data', async () => {
    // const resp1 = await request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(201);
    // const cookie = resp1.get('Set-Cookie');
    const cookie = await global.signin('tom1@tom.tom', 'tom@tom.tom');
    const resp = await request(app).get('/api/users/currentuser').set('Cookie', cookie).send({});
    //console.log('resp.body' , resp.body);
    expect(resp.body.currentUser.email).toEqual('tom1@tom.tom');
});

it('responds with null if not authenticated', async () => {
    const resp = await request(app).get('/api/users/currentuser').send({});
    //console.log('resp.body' , resp.body);
    expect(resp.body.currentUser).toEqual(null);
});