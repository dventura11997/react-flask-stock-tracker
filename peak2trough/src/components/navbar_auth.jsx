import '../App.css'
import SignOut from './sign_out';

function NavbarAuth() {
    return (
        <div className='navbar'>
            <nav>
                <a href='/home' className='navlink'>Home</a>
                <a href='/stock' className='navlink'>Stock</a>
                <a href='/my_stocks' className='navlink'>My stocks</a>
                <SignOut/>
            </nav>
        </div>
    )    
}

export default NavbarAuth;