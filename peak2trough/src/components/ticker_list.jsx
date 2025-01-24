import React, { useState } from 'react';
import GetBackendData from './get_backend_data';

function TickerList() {
    const backendurl = 'http://127.0.0.1:5000/stock_kpis';
    const [stockData, setStockData] = useState([]);

    return (
        <div>
            <GetBackendData backendurl={backendurl} onDataFetched={setStockData} />
            {stockData.map((stock, index) => (
            <li key={index}>{stock.ticker}</li>
            ))}
        </div>
    )
}

export default TickerList;