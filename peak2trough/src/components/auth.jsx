import '../App.css'
import NavbarAuth from './navbar_auth';
import NavbarUnauth from './navbar_unauth';

function Auth() {
    const token = localStorage.getItem('token'); // Retrieve JWT token

    return (
        <div>
            {token ? <NavbarAuth/> : <NavbarUnauth/>}
        </div>
    );
}

export default Auth;