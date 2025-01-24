import { useEffect } from 'react';
import '../App.css';

function GetBackendData({ backendurl, onDataFetched }) {
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    'Content-Type': 'application/json',
                };

                // Add Authorization header if token exists
                if (token) {
                    headers['Authorization'] = token;
                }

                const response = await fetch(backendurl, { method: 'GET', headers });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                onDataFetched(data);
                console.log('Fetched data from backend:', data); // Log data inside the .then() block
            } catch (error) {
                console.error('Error fetching data:', error);
                // Optionally handle no token scenario here (e.g., redirect or show a message)
            }
        };

        fetchData();
    }, [backendurl, onDataFetched, token]);

    return null;
}

export default GetBackendData;


// import { useEffect } from 'react'
// import '../App.css'

// function GetBackendData({ backendurl, onDataFetched }) {
//     const token = localStorage.getItem('token');

//     useEffect(() => {
//         if (token) {
//             fetch(backendurl, {
//                 method: 'GET',
//                 headers: {'Content-Type': 'application/json',
//                     'Authorization': token,
//                 },
//             })
//             .then(response => response.json())
//             .then(data => {
//                 onDataFetched(data);
//                 console.log('Fetched data from backend:', data); // Log data inside the .then() block
//             })
//             .catch(error => console.error('Error fetching data:', error));
//         }
//     }, [backendurl, onDataFetched]);

//     return null
// }

// export default GetBackendData;