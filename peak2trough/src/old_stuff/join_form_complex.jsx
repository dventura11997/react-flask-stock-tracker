import '../App.css'
import React, { useState } from 'react';

function JoinForm() {
    console.log("JoinForm component is rendering");

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setErrorMessage('');

        if (!validateEmail(email))
            setErrorMessage("This email is not valid")
        else
            {console.log("Form submitted with:", { firstName, lastName, email });}
            // You can add more logic here, like form validation or API submission
    };

    return (
        <div className='form-container'>
            <h1 className='secondary-heading'>Join Us!</h1>
            <form onSubmit={handleSubmit}>
                <input className='form-field' placeholder="First name" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" className='form-field' value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="text" className='form-field' value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="submit" value="join"/>
            </form>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    )
}

export default JoinForm;