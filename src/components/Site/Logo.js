
import { useNavigate } from 'react-router-dom';

function Logo() {

    //navigation
    const navigate = useNavigate();

    //images
    const logo = `/images/logo.png`;
    const logoHover = `/images/logo_hover.png`;

    return (

        <img id="logo" onClick={() => navigate('/')}
            src={logo}
            onMouseOver={e => (e.currentTarget.src = logoHover)}
            onMouseOut={e => (e.currentTarget.src = logo)}
        />
    )
}

export default Logo
