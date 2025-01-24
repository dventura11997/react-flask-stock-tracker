import '../App.css'
import { useNavigate } from 'react-router-dom';

function ClickRoute() {
    const navigate = useNavigate();
    
    const handleClick = () => {
        navigate('/stock');
      };

    return (
        <button class="button" onClick={handleClick}>Go to stock page</button>
    );
}

export default ClickRoute;
