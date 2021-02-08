// const fetch = require("node-fetch");
// fetch('http://ticketing.com:8082/api/users/signup', 
//     {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: {
//             mail: '123',
//             pass: 'abcdabcd'
//         }
//     }).then( res => {
//         console.log(res);
//     }).catch(err => {console.log(err)});


// const axios = require('axios');
// import axios from 'axios';

// axios.post('https://ticketing.com:8082/api/users/signup', { 
//     withCredentials: true,
//         mail: 'test@test.test',
//         pass: 'test@test.test'
// }).then(resp=> console.log(resp.headers))
// .catch(err => console.log(err));


const Axios = require("axios").default;

Axios.request({
    method: "POST",
    url: "http://ticketing.com:8082/api/users/signin",
    data: {
        mail: 'test5@test.test',
        pass: 'test5@test.test'
    },
    withCredentials: true
}).then(res => {
    console.log(res.data);
}).catch(err => console.log(err));