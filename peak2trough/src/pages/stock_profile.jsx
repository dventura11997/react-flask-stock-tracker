import '../App.css'
import Footer from '../components/footer.jsx';
import Auth from '../components/auth.jsx';
import StockTable from '../components/stock_table.jsx';


function Stock() {
    return (
    <div>
        <section className='responsive-container'>
            <div className='left'></div>
            <div className='middle'>
                <Auth/>
                <StockTable/>
            </div>
            <div className='right'></div>
        </section>
        <Footer/>
    </div>
    )
}

export default Stock;