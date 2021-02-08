import Link from 'next/link';
const Header = ({currentUser}) => {
    console.log('currentUser', currentUser);
    const links = [ 
        !currentUser && { label: 'Sign Up', href: '/auth/signup'},
        !currentUser && { label: 'Sign In', href: '/auth/signin'},
        currentUser && { label: 'Sell tickets', href: '/tickets/new'},
        currentUser && { label: 'My Orders', href: '/orders'},
        currentUser && { label: 'Sign Out', href: '/auth/signout'}
    ].filter(lnkCfg => lnkCfg);

    //const rndrLink = links.map((lnk, indx) => <li key={indx}><Link href={lnk.href}>{lnk.label}</Link></li>);
    return (
        <nav className='navbar navbar-light bg-light'>
            <Link href='/'>
                <a className='navbar-brand'>Ticketeer</a>
            </Link>
            <div className='d-flex justify-content-end'>
                <ul className='nav d-flex align-items-center'>
                    {links.map((lnk, indx) => <li key={indx} className='nav-link'><Link href={lnk.href}>{lnk.label}</Link></li>)}
                </ul>
            </div>
        </nav>
    );
};

export default Header;