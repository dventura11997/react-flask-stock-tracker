import '../App.css'

function NavbarUnauth() {
    return (
        <div className='navbar'>
            <nav>
                <a href='/home' className='navlink'>Home</a>
                <a href='/stock' className='navlink'>Stock</a>
                <a href='/login' className='navlink'>Login</a>
                <a href='/join' className='navlink-button'>Join</a>
            </nav>
        </div>
    )    
}

export default NavbarUnauth;