import Router from 'next/router';
import useRequest from '../../hooks/useRequest';
import { useEffect } from 'react';


const SignOut = () => {
    const {doRequest} = useRequest({ url: '/api/users/signout', method:'post', body: {}, onSuccess: ()=> {Router.push('/');} });
    useEffect(() => {
        doRequest();
    }, []);

    return (
        <div> Signing out ... </div>
    );
};

export default SignOut;