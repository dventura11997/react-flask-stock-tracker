import '../App.css'
import { useLocation } from 'react-router-dom';
import FormSubmit from './form_submit';

function AlertForm() {
    const { successMessage, errorMessage, handleSubmit } = FormSubmit(
        'http://127.0.0.1:5000/save_alert', // Form submission URL
        'my_stocks', 
        'There was an error submitting the form. Please try again.' // Custom error message
      );
    
    const location = useLocation();
    const ticker = location.state?.ticker || ''; // Default to an empty string if no state is passed

    return (

        <div className='form-container'>
            <h1 className='secondary-heading'>Set Alert</h1>

            <div className="success-message">{successMessage}</div>
            <div className="error-message">{errorMessage}</div>
            
            <form onSubmit={handleSubmit} method="POST">
                <h2 className='form-heading'>Alert Type</h2>
                    <select className='form-field' placeholder="Alert Type" name="AlertType" required>
                        <option value="" disabled>Select your alert type</option>
                        <option value="Price alert">Price alert</option>
                    </select>
                <h2 className='form-heading'>Ticker</h2>
                    <input className='form-field' placeholder="Ticker" type="text" name="Ticker" value={ticker} min="0" required />
                <h2 className='form-heading'>Price</h2>
                    <input className='form-field' placeholder="Price" type="number" name="AlertThreshold" min="0" required />
                <button className='button-form' type="submit" value="SetAlert">Set Alert</button>
            </form>
        </div>
    );
}

export default AlertForm;