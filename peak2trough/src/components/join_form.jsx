import '../App.css';
import Redirect from './redirect';
import FormSubmit from './form_submit';

function JoinForm() {
    const { successMessage, errorMessage, redirectTo, handleSubmit } = FormSubmit(
        'http://127.0.0.1:5000/join', // Form submission URL
        'login', // Redirect to 'login' on success (can be any route)
        'There was an error submitting the form. Please try again.' // Custom error message
      );
    return (

        <div className='form-container'>
            <h1 className='secondary-heading'>Join Us!</h1>

            <div className="success-message">{successMessage}</div>
            <div className="error-message">{errorMessage}</div>

            {redirectTo && <Redirect page={redirectTo} />}

            <form onSubmit={handleSubmit} method="POST">
                <h2 className='form-heading'>Personal Details</h2>
                <div className='grid'>
                    <input className='form-field' placeholder="First name" type="text" name="FirstName" required />
                    <input className='form-field' placeholder="Last name" type="text" name="LastName" required />
                    <input className='form-field' placeholder="Email" type="email" name="Email" required />
                    <input className='form-field' placeholder="Password" type="password" name="Password" required />
                </div>
                <h2 className='form-heading'>Financial Details</h2>
                <div className='grid'>
                    <select className='form-field' placeholder="Preferred Broker" name="PreferredBroker" required>
                        <option value="" disabled>Select your preferred broker</option>
                        <option value="Commsec">Commsec</option>
                        <option value="Nabtrade">Nabtrade</option>
                        <option value="Etrade">Etrade</option>
                    </select>
                </div>
                <input className='button-form' type="submit" value="Join" /> 
            </form>
        </div>
    );
}

export default JoinForm;