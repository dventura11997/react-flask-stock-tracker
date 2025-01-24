import '../App.css'
// import Navbar from '../components/navbar';
import Footer from '../components/footer';

function ErrorPage() {
    return (
        <div>
            <section className='responsive-container'>
                <div className='left'></div>
                <div className='middle'>
                    <Auth/>
                    <h1 className='major-heading'>
                        Error 404: No page found
                    </h1>
                </div>
                <div className='right'></div>
            </section> 
            <Footer/>
        </div>
    )
}

export default ErrorPage;