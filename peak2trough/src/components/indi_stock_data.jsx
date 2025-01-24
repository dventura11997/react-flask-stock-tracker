import '../App.css'
import { useParams } from 'react-router-dom';
import React, { useState } from 'react';
import GetBackendData from './get_backend_data.jsx';
import { Chart as ChartJS, LineElement, LinearScale, PointElement, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

// Register required Chart.js components
ChartJS.register(LineElement, LinearScale, PointElement, Tooltip, Legend, TimeScale);

function IndiStockData() {
    // Get Ticker param from App.jsx routing
    const { ticker } = useParams();
    // Create a constant for the stock data which maintains state using useState
    const [stockKpiData, setStockKpiData] = useState([]);
    const [stockTsData, setStockTsData] = useState([]);
    // Param required to get Backend data
    const backendurl1 = 'http://127.0.0.1:5000/stock_kpis';
    const backendurl2 = 'http://127.0.0.1:5000/stock_ts'

    return (
        <div>
            <GetBackendData backendurl={backendurl1} onDataFetched={setStockKpiData} />
            <GetBackendData backendurl={backendurl2} onDataFetched={setStockTsData} />
            {/* Check if ticker from the route exists in the stockData */}
            {stockKpiData.length === 0 ? (
                <div>Loading data...</div>
                ) : (
                    stockKpiData.some(stock => stock.ticker === ticker) ? (
                        <>
                            {stockKpiData.filter(stock => stock.ticker === ticker).map((stock, index) => (
                                <div key={index}>
                                    <div className="stock-ticker-card"> {stock.ticker}</div>
                                    <div className="button-stock-info-container">
                                        <div className="stock-info-grid-container">
                                        
                                        </div>
                                    </div>
                                    <div className="stock-kpi-grid">
                                        <div className="kpi-card">
                                            <h2 className="card-heading">
                                                Peak
                                            </h2>
                                            {stock.highest_price}
                                        </div>
                                        <div className="kpi-card">
                                            <h2 className="card-heading">
                                                Last close
                                            </h2>
                                            {stock.last_close}
                                        </div>
                                        <div className="kpi-card">
                                            <h2 className="card-heading">
                                                Peak to current
                                            </h2>
                                            {stock.peak_to_current}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div>
                                <Line
                                    data={{
                                        labels: stockTsData.map((data) => data.Date),
                                        datasets: [{
                                            label: "Price",
                                            data: stockTsData
                                                .filter((data) => data.Ticker === ticker)    
                                                .map((data) => data.Close),
                                            borderColor: '#382110',
                                            backgroundColor: '#382110',
                                            }]
                                    }}
                                    options={{
                                        scales: {
                                          x: {
                                            type: 'time', // Use time scale for x-axis
                                            distribution: "linear"
                                          }
                                        }
                                      }}
                                />
                            </div>
                        </>                       
                    ) : (
                        <div>Invalid ticker: {ticker}</div>
                    )
                )} 
            </div>
    )
}

export default IndiStockData;

