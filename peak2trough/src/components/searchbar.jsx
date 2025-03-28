import '../App.css'
import Redirect from './redirect.jsx'
import GetBackendData from './get_backend_data.jsx';
import { useState } from 'react';

function Searchbar() {
    const [inputValue, setInputValue] = useState("");
    const [stockTickers, setStockTickers] = useState([]);
    const backendurl = 'http://127.0.0.1:5000/stock_kpis';
    const [redirectPage, setRedirectPage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setRedirectPage(`stock/${inputValue.toUpperCase()}`); // Set redirect URL dynamically based on inputValue
    };

     // Handle selecting a ticker from the dropdown
     const handleItemClick = (item) => {
        setInputValue(item.ticker); // Update the input field with the selected ticker
        setRedirectPage(`stock/${item.ticker.toUpperCase()}`); // Redirect directly to the stock page
    };

    return (
        <div className='searchbar-container'>
            <GetBackendData backendurl={backendurl} onDataFetched={setStockTickers} />
            <form onSubmit={handleSubmit} className="form-field-with-button">
                <input type="text" placeholder="Enter a stock ticker on the US or AU stock exchange..." className="form-field-home" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                <button type="submit" className='button'>Search</button>
                {inputValue && (
                    <div className='dropdown-content'>
                        {stockTickers
                                .filter(item => item.ticker.toUpperCase().startsWith(inputValue.toUpperCase()))
                                .slice(0, 10)
                                .map((item, index) => (
                                    <div key={index} className="dropdown-item" onClick={() => handleItemClick(item)}>{item.ticker}</div>
                                ))
                            }
                    </div>
                )}
            {redirectPage && <Redirect page={redirectPage} />}
            </form>
        </div>
    );
}

export default Searchbar