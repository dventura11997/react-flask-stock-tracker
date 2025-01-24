import '../App.css';

function Footer() {
    return(
        <footer className='footer'>
            <div className='footer-grid'>
                <div className='footer-content'>
                    <a href='/home' className='footer-text'>Home</a>
                    <a href='/stock' className='footer-text'>Stock</a>
                    <a href='/login' className='footer-text'>Login</a>
                    <a href='/join' className='footer-text'>Join</a>
                </div>
                <p className='footer-text'>
                    Lorem Impsum text about great business!
                </p>
            </div>
        </footer>
    );
}

export default Footer