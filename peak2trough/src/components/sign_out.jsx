import React from 'react';
import Redirect from './redirect';
import { useState } from 'react';


function SignOut() {
    const [redirectTo, setRedirectTo] = useState(null);
    const handleSignOut = () => {
        localStorage.removeItem('token'); // Remove the JWT from localStorage
        setRedirectTo('home'); // Trigger redirect after token removal
    };

    return (
        <>
            {redirectTo && <Redirect page={redirectTo} />}
            <a onClick={handleSignOut}  className='navlink-button'>
                Sign Out
            </a>
        </>
    );
}

export default SignOut;