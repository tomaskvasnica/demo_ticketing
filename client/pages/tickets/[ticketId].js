import reqHook from '../../hooks/useRequest';
import Router from 'next/router';

const TicketDisplay = ({ticket}) => {
    const { doRequest, errs } = reqHook({url: '/api/orders', method: 'post', body: {ticketId: ticket.id}, onSuccess: (order)=> {
        console.log('order: ', order);
        Router.push(`/orders/${order.id}`);
        //Router.push('/orders/[orderId]', `/orders/${order.id}`);
    }});
    
    const onTickPurrchase = () => {
        doRequest();
    };
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>{ticket.price}</h4>
            {errs}
            <button className='btn btn-primary' onClick={onTickPurrchase}>Purchase</button>
        </div>
    )
};

TicketDisplay.getInitialProps = async (ctxt, client) => {
    const { ticketId } = ctxt.query;
    const { data } = await client.get(`/api/tickets/${ticketId}`);
    return { ticket: data };
};

export default TicketDisplay;