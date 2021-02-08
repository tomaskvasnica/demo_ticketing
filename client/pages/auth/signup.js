import Router from 'next/router';
import {useState} from 'react';
import useRequest from '../../hooks/useRequest';

const Signup = () => {
    const [mail, setMail] = useState('');
    const [pass, setPwd] = useState('');
    const {doRequest, errs} = useRequest({ url: '/api/users/signup', method:'post', body: {mail, pass}, onSuccess: ()=>{ Router.push('/'); } })

    const handleMailChange = (evt) => {
        setMail(evt.target.value);
    };

    const handlePwdChange = (evt) => {
        setPwd(evt.target.value);
    };

    const submitHandler = async (evt) => {
        evt.preventDefault();
        doRequest();
    };

    return (
        <form onSubmit={submitHandler}>
            <h1>Registrácia</h1>
            <div className='form-group'>
                <label>Email</label>
                <input type='text' className='form-control' value = {mail} onChange={handleMailChange}/>
            </div>
            <div className='form-group'>
                <label>Password</label>
                <input type='password' className='form-control' value={pass} onChange={handlePwdChange}/>
            </div>
            {errs}
            <button className='btn btn-primary'>hello there</button>
        </form>
    );
};

export default Signup;