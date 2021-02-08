import request from 'supertest';
import {app} from  '../../app';

// it('returns 201 on successfull signup', async () => {
//     return request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'})
//     .expect(201);
//     /api/users/signin
// });

it('is expected to clear cookies after signout', async ()=> {
    await request(app).post('/api/users/signup').send({ mail: 'tom@tom.tom', pass: 'tomjones'}).expect(201);
    const resp = await request(app).post('/api/users/signout').send({});
    //expect(resp.get('Set-Cookie')).toBeNull();
    expect(
        resp.get('Set-Cookie').shift()
      ).toMatch(/1970/);
});