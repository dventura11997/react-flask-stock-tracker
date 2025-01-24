import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Redirect = ({ page, state }) => {
    const navigate = useNavigate(); // This gives you the navigate function

    useEffect(() => {
        if (page) {
            navigate(`/${page}`, { state }); // Redirects to the given page
        }
    }, [page, state, navigate]);
    return null;
    
}

export default Redirect;