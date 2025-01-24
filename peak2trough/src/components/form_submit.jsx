import { useState } from "react";

function FormSubmit(submitUrl, onSuccess, onFailure) {
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [redirectTo, setRedirectTo] = useState(null);
    const token = localStorage.getItem('token'); // Retrieve JWT token
    
    const handleSubmit = async (e) => {
        
        e.preventDefault();

        const data = Object.fromEntries(new FormData(e.target).entries());

        try {
            const headers = {
                'Content-Type': 'application/json',
            };

            // Only add Authorization header if the token exists
            if (token) {
                headers['Authorization'] = token;
            }


            const response = await fetch(submitUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data),
        
        });
            const result = await response.json();

            if (response.ok) {
                setSuccessMessage('Form submitted successfully!');
                setErrorMessage(null);

                if (result.token) {
                    localStorage.setItem('token', result.token);  // Store JWT token
                    console.log('JWT token saved:', result.token);
                }

                setRedirectTo(onSuccess || null);
            } else {
                setErrorMessage(error.message || 'Form submission failed');
            }

    } catch (error) {
        console.error(error);
        setErrorMessage(error.message || 'Form submission failed');
        setSuccessMessage(null);
    }            
    };
    console.log(handleSubmit);
    return {
        successMessage,
        errorMessage,
        redirectTo,
        handleSubmit,
      };
}

export default FormSubmit;