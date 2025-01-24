import '../App.css'
// import Navbar from '../components/navbar.jsx';
import Auth from '../components/auth.jsx';
import React from 'react';
import IndiStockData from '../components/indi_stock_data.jsx';
import Footer from '../components/footer.jsx';

function IndiStockPage() {
    
    return (
        <div>
            <section className='responsive-container'>
                <div className='left'></div>
                <div className='middle'>
                    <Auth/>
                    <IndiStockData/>
                </div>
                <div className='right'></div>
            </section> 
            <Footer/>
        </div>
    )
}

export default IndiStockPage;