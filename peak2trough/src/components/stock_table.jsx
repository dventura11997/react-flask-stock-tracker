import React, { useState } from 'react'
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../App.css'
import GetBackendData from './get_backend_data';
import FormSubmit from './form_submit';

function StockTable() {
    const [stockData, setStockData] = useState([]);
    const [selectedExchange, setSelectedExchange] = useState(""); // State for dropdown selection
    const backendurl = 'http://127.0.0.1:5000/stock_kpis';
    const { successMessage, errorMessage, handleSubmit } = FormSubmit(
        'http://127.0.0.1:5000/save_stock', // Form submission URL
      );

    const handleExchangeChange = (event) => {
        setSelectedExchange(event.target.value); // Update the selected exchange
    };

    const filteredStocks = selectedExchange
        ? stockData.filter((stock) => stock.exchange === selectedExchange)
        : stockData; // Filter stocks based on selected exchange

    return (
    <div>

        <div className="success-message">{successMessage}</div>
        <div className="error-message">{errorMessage}</div>

        <GetBackendData backendurl={backendurl} onDataFetched={setStockData} />
        <select className='form-field' placeholder="Stock Exchange" name="Stock Exchange" required value={selectedExchange} onChange={handleExchangeChange}>
            <option value="" disabled>Select stock exchange</option>
            {Array.from(new Set(stockData.map((stock) => stock.exchange))).map((exchange, index) => (
                <option key={index} value={exchange}>
                    {exchange}
                </option>
            ))}
        </select>
        <table className='stock-table'>
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Highest price</th>
                    <th>Last close</th>
                    <th>Peak to current</th>
                    <th>More info</th>
                    <th>Add stock</th>
                </tr>
            </thead>
            <tbody>
                {filteredStocks.map((stock, index) => (
                    <tr key={index}>
                        <td>{stock.trn_ticker}</td>
                        <td>{stock.highest_price}</td>
                        <td>{stock.last_close}</td>
                        <td>{stock.peak_to_current}</td>
                        <td>
                            <Link to={`/stock/${stock.ticker}`}>More Info</Link>
                        </td>
                        <td>
                            <form onSubmit={handleSubmit} method='POST'>
                                <input type="hidden" name='Ticker' value={stock.ticker} />
                                <button type="submit" className='button'>Add</button>
                            </form>
                        </td>
                    </tr>
                ))} 
            </tbody>
        </table>
    </div>
        
    ); 
}

export default StockTable;