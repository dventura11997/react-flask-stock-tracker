import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/homepage.jsx'
import Stock from './pages/stock_profile.jsx'
import Join from './pages/join.jsx'
import Login from './pages/login.jsx'
import MyStocks from './pages/my_stocks.jsx'
import ErrorPage from './pages/error_page.jsx'
import IndiStockPage from './pages/indi_stock_page.jsx'
import TickerList from './components/ticker_list.jsx'
import AlertPage from './pages/alert_page.jsx'

//App Start-up: cd peak2trough > npm run dev

function AppRoutes() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<HomePage />}/>
          <Route path='/home' element={<HomePage />}/>
          <Route path='/join' element={<Join />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/stock' element={<Stock />}/>
          <Route path='/my_stocks' element={<MyStocks />}/>
          <Route path='/indi' element={<TickerList />}/>
          <Route path='/alerts' element={<AlertPage />}/>
          <Route path='/stock/:ticker' element={<IndiStockPage />} /> 
          <Route path='*' element={<ErrorPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default AppRoutes