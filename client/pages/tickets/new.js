import React, { useState } from 'react';
import reqHook from '../../hooks/useRequest';
import Router from 'next/router';
const NewTicket = () => {
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');

    const {doRequest, errs}  = reqHook({ url: '/api/tickets', method: 'post', body: {title, price}, onSuccess: (ticket)=> {
        console.log('ticket', ticket);
        Router.push('/');
    }});

    const titleChangeHandler = (evt) => {
        setTitle(evt.target.value);
    };

    const priceChangeHandler = (evt) => {
        setPrice(evt.target.value);
    };

    const onPriceBlur = () => {
        const val = parseFloat(price);
        if (isNaN(val)) {
            return;
        }
        setPrice(val.toFixed(2));
    }
    const onSubm = (evt) => {
        evt.preventDefault();
        console.log(' before doRequest ');
        doRequest();
    }

    return (
        <div>
            <h1>Create a new ticket</h1>
            <form onSubmit={onSubm}>
                <div className='form-group'>
                    <label>Ticket title</label>
                    <input type='text' className='form-control' value={title} onChange={titleChangeHandler} />
                </div>
                <div className='form-group'>
                    <label>Price</label>
                    <input type='text' className='form-control' value={price} onChange={priceChangeHandler} onBlur={onPriceBlur}/>
                </div>.
                {errs}
                <button className='btn btn-primary'>Submit</button>
            </form>
        </div>
    )
};
export default NewTicket;