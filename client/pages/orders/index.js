const OrderList = ({orders, currentUser}) => {
    const ordList = orders.map((ordr) => {
        return (
            <li key={ordr.id}>{ordr.ticket.title} - {ordr.status}</li>
        )
    });
    return (
        <>
            <h1> Orders of: {currentUser.email}</h1>
            <ul>{ordList}</ul>
        </>
    )
};

OrderList.getInitialProps = async (ctx, client)=> {
    const {data} = await client.get('/api/orders');
    return {orders: data};
}

export default OrderList;