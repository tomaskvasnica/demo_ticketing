//import buildClient from '../api/buildClient';
import Link from 'next/link';

const Index = ( {currentUser, tickets} ) => {
    //console.log( 'tickets', tickets );
    //return currentUser ? <h1>You are logged in as: <span className='text-danger'>{currentUser.email}</span></h1>: <h1>Please log in</h1>;
    const ticlist = tickets.map((tick) => {
        return (
        <tr key={tick.id}>
            <td>{tick.title}</td>
            <td>{tick.price}</td>
            <td>{tick.orderId === undefined ? 'Available': 'Unavailable'}</td>
            <td><Link href='/tickets/[ticketId]' as={`/tickets/${tick.id}`}>{tick.title}</Link></td>
        </tr>)
    });

    return ( 
        <div>
            <h1>Tickets</h1>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Detail</th>
                    </tr>
                </thead>
                <tbody>
                    {ticlist}
                </tbody>
            </table>
        </div>
    );
};

Index.getInitialProps = async ( props, client, currentUser ) => {
// const client = buildClient(props);
    const {data} = await client.get('/api/tickets');
    console.log('tickets data', data);
    return {tickets: data};
//    return props;
};

export default Index;