import 'bootstrap/dist/css/bootstrap.min.css';
import buildClient from '../api/buildClient';
import Header from '../components/header';
const App = ({Component, pageProps, currentUser }) => {
    //const App = (appProps) => {
    return (
        <>
        <Header currentUser={currentUser} />
        <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
        </div>
        </>
    );
};

App.getInitialProps = async (props) => {
    //console.log(props.ctx.req.headers);
    console.log('app.getInitialProps', Object.keys(props.ctx));
    const client = buildClient(props.ctx);
    const {data} = await client.get('/api/users/currentuser');
    console.log('data: ', data);
    let pageProps = {};
    if (props.Component.getInitialProps) {
        pageProps = await props.Component.getInitialProps(props.ctx, client, data.currentUser);
    }
    return {pageProps, ...data };
    //return {};
};

export default App;