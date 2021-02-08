import {useState, useEffect} from 'react';
import StripeCheckout from 'react-stripe-checkout';
import reqHook from '../../hooks/useRequest';
import Router from 'next/router';

const ShowOrder = ( {order, currentUser} ) => {
    const [timeLft, setTmlft] = useState(0);
    const { doRequest, errs } = reqHook({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: (paymnt) => {
            console.log(paymnt);
            Router.push('/orders');
        }
    })

    const tmLeft = () => {
        let msLeft = new Date(order.expiresAt) - new Date();
        setTmlft(Math.round(msLeft / 1000));
    };

    useEffect(()=> {
        tmLeft();
        const timid = setInterval(tmLeft, 1000);

        return () => {
            clearInterval(timid);
        }
    }, []);

    if (timeLft < 0) {
        return <div> Order Expired </div>
    }
    
    return (
        <div>
            <h1>Order detail</h1>
            <p>{timeLft} secods left </p>
            {errs}
            <StripeCheckout 
                token={( token )=>{ 
                    console.log('stripe checkout token', token);
                    doRequest({token: token.id});
                }}
                stripeKey='pk_test_51IHCyLAtMyWQ8KjATiSyrLvSmGZPjS1xQlavq0riRMbyDoLqXz8DOd53kjaLXNZE9Sv2py7Q0gt1EOzb4PhlWenC00ESZbsrMB'
                amount={order.ticket.price * 100}
                email={currentUser.email}
            />
        </div>
    )
};

ShowOrder.getInitialProps = async (ctxt, client) => {
    const { orderId } = ctxt.query;
    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
};

export default ShowOrder;