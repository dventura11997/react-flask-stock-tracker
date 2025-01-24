import '../App.css'
// import Navbar from '../components/navbar';
import Auth from '../components/auth';
import LoginForm from '../components/login_form';
import Footer from '../components/footer';

function Login() {
    return (
        <div>
            <section className='responsive-container'>
                <div className='left'></div>
                <div className='middle'>
                    <Auth/>
                    <div>
                        <LoginForm/>
                    </div>
                </div>
                <div className='right'></div>
            </section> 
            <Footer/>
        </div>
    )
}

export default Login;