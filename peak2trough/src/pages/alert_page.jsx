import '../App.css'
// import Navbar from '../components/navbar_unauth';
import Auth from '../components/auth';
import Footer from '../components/footer';
import AlertForm from '../components/alert_form';

function AlertPage() {
    return (
        <div>
            <section className='responsive-container'>
                <div className='left'></div>
                <div className='middle'>
                    <Auth/>
                    <AlertForm/>
                </div>
                <div className='right'></div>
            </section> 
            <Footer/>
        </div>
    )
}

export default AlertPage;