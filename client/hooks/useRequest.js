import axios from 'axios';
import { useState } from 'react';

const useRequest = ({ url, method, body, onSuccess }) => {
    const [errs, setErrs] = useState(null);

    const doRequest = async (props = {}) => {
        try {
            setErrs(null);
            console.log(`about to call axios method ${method} with url ${url} and body ${JSON.stringify(body)}`);
            const resp = await axios[method](url, {...body, ...props});
            if (onSuccess) {
                onSuccess(resp.data);
            }
            return resp.data;
        } catch (e) {
            console.log('e.response: ', e);
            setErrs(
                <div className='alert alert-danger'>
                    <h4> hoplaaaaa </h4>
                    <ul className='my-0'>
                        {e.response.data.errors.map((error, indx) => <li key={indx}>{error.message}</li>)}
                    </ul>
                </div>
            );
        }
    };

    return { doRequest, errs };
};

export default useRequest;