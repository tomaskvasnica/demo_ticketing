const Axios = require("axios").default;
const jwt = require('jsonwebtoken');

//await request(app).put('/api/tickets/60115e521fae4c32309017d6').set('Cookie', global.cookie()).send().expect(404);

const createCookie = () => {
    const token = jwt.sign( {id: '12345', email:'tom@tom.tom'}, process.env.JWT_SALT || 'mytestsalt');
    const session = { jwt: token };
    const sessJson = JSON.stringify(session);
    const base64 = Buffer.from(sessJson).toString('base64');
    return ['express:sess=' + base64];
}

Axios.request({
    method: "POST",
    url: "http://ticketing.com:8082/api/payments",
    headers: {
        Cookie: createCookie()
    },
    data: {
        orderId: '601c584cc11ba4001934fd0b',
        token: 'tok_visa'
    },
    withCredentials: true
}).then(res => {
    console.log(res.data);
}).catch(err => {console.error(err); console.log(err.message); });

///api/users/signin

//post