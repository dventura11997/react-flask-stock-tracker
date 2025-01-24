import '../App.css'
// import Navbar from '../components/navbar';
import Auth from '../components/auth';
import ProfileTable from '../components/profile_table';
import Footer from '../components/footer';

function MyStocks() {

    return (
        <div>
            <section className='responsive-container'>
                <div className='left'></div>
                <div className='middle'>
                    <Auth/>
                    <ProfileTable/>
                </div>
                <div className='right'></div>
            </section>
            <Footer/>
        </div>
    )
}

export default MyStocks;