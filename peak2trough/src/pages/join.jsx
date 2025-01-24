import '../App.css'
// import Navbar from '../components/navbar.jsx';
import Auth from '../components/auth.jsx';
import JoinForm from '../components/join_form.jsx';
import Footer from '../components/footer.jsx';


function Join() {
    return (
        <div>
            <section className='responsive-container'>
                <div className='left'></div>
                <div className='middle'>
                    <Auth/>
                    <div>
                        <JoinForm/>
                    </div>
                        </div>
                <div className='right'></div>
            </section> 
            <Footer/>
        </div>
    )
}

export default Join;