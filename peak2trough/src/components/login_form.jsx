import '../App.css'
import FormSubmit from './form_submit';
import Redirect from './redirect';

function LoginForm() {
    const { successMessage, errorMessage, redirectTo, handleSubmit } = FormSubmit(
        'http://127.0.0.1:5000/login', // Form submission URL
        'stock', 
        'There was an error submitting the form. Please try again.' // Custom error message
      );

    return (

        <div className='form-container'>
            <h1 className='secondary-heading'>Login</h1>

            <div className="success-message">{successMessage}</div>
            <div className="error-message">{errorMessage}</div>

            {redirectTo && <Redirect page={redirectTo} />}
            
            <form onSubmit={handleSubmit} method="POST">
                <h2 className='form-heading'>Email</h2>
                <input className='form-field' placeholder="Email" type="email" name="Email" required />
                <h2 className='form-heading'>Password</h2>
                <input className='form-field' placeholder="Password" type="password" name="Password" required />
                <input className='button-form' type="submit" value="Login" /> 
            </form>
        </div>
    );
}

export default LoginForm;