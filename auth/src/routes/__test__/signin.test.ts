import request from 'supertest';
import {app} from  '../../app';

// it('returns 201 on successfull signup', async () => {
//     return request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'})
//     .expect(201);
//     /api/users/signin
// });

it('fails if email is not registered', async ()=> {
    await request(app).post('/api/users/signin').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(500);
});

it('fails if incorrect password is supplied', async ()=> {
    await request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(201);
    await request(app).post('/api/users/signin').send({ mail: 'tom@tom.tom', pass: 'tomjones1'}).expect(500);
});

it('we are correctly logged in and cookies are returned', async ()=> {
    await request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(201);
    await request(app).post('/api/users/signin').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(200);
});

it('we are correctly logged in and cookies are returned', async ()=> {
    await request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(201);
    const resp = await request(app).post('/api/users/signin').send({ mail: 'tom@tom.tom', pass: 'tomjones'});
    expect(resp.get('Set-Cookie')).toBeDefined();
});