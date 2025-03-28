import '../App.css'
import Searchbar from '../components/searchbar.jsx';
import Auth from '../components/auth.jsx';
import Footer from '../components/footer.jsx';

function HomePage() {
  return (
    <div>
        <section className='responsive-container'>
            <div className='left'></div>
            <div className='middle'>
                <Auth/>
                <div className="major-heading">
                  peak2trough
                </div>
                <div className="form-heading home">
                  Back-end database is currently being migrated from a local server to a cloud database so only functioning intermittently.
                </div>
                <Searchbar/>
            </div>
            <div className='right'></div>
        </section> 
        <Footer/>
    </div>
  ); 
}

export default HomePage;