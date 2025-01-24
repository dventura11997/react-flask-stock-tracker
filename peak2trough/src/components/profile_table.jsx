import React, { useState } from 'react'
import '../App.css'
import GetBackendData from './get_backend_data';
import FormSubmit from './form_submit';
import Redirect from './redirect';

function ProfileTable() {
    const backendurl = 'http://127.0.0.1:5000/profile';
    const [ ProfileData, setProfileData ] = useState([]);
    const { successMessage, errorMessage, handleSubmit } = FormSubmit(
        'http://127.0.0.1:5000/save_alert', // Form submission URL
      );
    const [redirectTo, setRedirectTo] = useState(null);

    
    return (
    <div>

        <div className="success-message">{successMessage}</div>
        <div className="error-message">{errorMessage}</div>

        {redirectTo && <Redirect page={redirectTo.page} state={redirectTo.state} />}
        <GetBackendData backendurl={backendurl} onDataFetched={setProfileData}/>
        <div>
            Email: {ProfileData[0]?.email || "N/A"} 
            First Name: {ProfileData[0]?.first_name || "N/A"} 
            Last Name: {ProfileData[0]?.last_name || "N/A"}
            Preferred Broker: {ProfileData[0]?.preferred_broker || "N/A"}
        </div>
        
        <table className='stock-table'>
            <thead>
                <tr>
                    <th>Ticker</th>
                    <th>Stock Name</th>
                    <th>Exchange</th>
                    <th>Location</th>
                    <th>Sector</th>
                    <th>Highest Price</th>
                    <th>Last close</th>
                    <th>Peak to current</th>
                    <th>Add alert</th>
                </tr>
            </thead>
            <tbody>
                {ProfileData.map((profile, index) => (
                    <tr key={index}>
                        <td>{profile.ticker}</td>
                        <td>{profile.stock_name}</td>
                        <td>{profile.exchange}</td>
                        <td>{profile.location}</td>
                        <td>{profile.sector}</td>
                        <td>{profile.highest_price}</td>
                        <td>{profile.last_close}</td>
                        <td>{profile.peak_to_current}</td>
                        <td>
                            <form>
                                <button type="button" onClick={() => setRedirectTo({ page: 'alerts', state: { ticker: profile.ticker } })}>Add alert</button>
                            </form>
                            {/* <form onSubmit={handleSubmit} method='POST'>
                                <input type="hidden" name='Ticker' value={profile.ticker} />
                                <button type="submit">Add</button>
                            </form> */}
                        </td>
                    </tr>
                ))} 
            </tbody>
        </table>
    </div>
        
    ); 
}

export default ProfileTable;