import request from 'supertest';
import {app} from  '../../app';

it('returns 201 on successfull signup', async () => {
    return request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'})
    .expect(201);
});

it('returns 400 in case of wrong email', async () => {
    return request(app).post('/api/users/signup').send({ mail: 'tom', pass: 'tomjones'})
    .expect(400);
});

it('returns 400 in case of wrong pass', async () => {
    return request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tom'})
    .expect(400);
});

it('returns 400 in case of missing mail or passwird', async () => {
    await request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom' })
    .expect(400);
    await request(app).post('/api/users/signup').send({ pass: 'tomjones' })
    .expect(400);
});

it('disallows duplicate email', async ()=> {
    await request(app).post('/api/users/signup').send({ mail: 'tom1@tom.tom', pass: 'tomjones'}).expect(201);
    await request(app).post('/api/users/signup').send({ mail: 'tom1@tom.tom', pass: 'tomjones'}).expect(500);
});

it('sets a cookie after successfull signup', async () => {
    const resp = await request(app).post('/api/users/signup').send({ mail: 'tom1@tom.tom', pass: 'tomjones'}).expect(201);
    expect(resp.get('Set-Cookie')).toBeDefined();
});