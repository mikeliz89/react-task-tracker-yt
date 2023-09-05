
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import * as Constants from '../../utils/Constants';

export default function Logo() {

    //navigation
    const navigate = useNavigate();

    //theme
    const { theme } = useTheme();

    //images
    const logo = `/images/logo.png`;
    const logo_dark = `/images/logo_dark.png`;
    const logoHover = `/images/logo_hover.png`;

    const getLogoSource = () => {
        if (theme === Constants.THEME_LIGHT) {
            return logo;
        }
        return logo_dark;
    }

    const getLogoSourceHover = () => {
        if (theme === Constants.THEME_LIGHT) {
            return logoHover;
        }
        return logoHover;
    }

    return (

        <img alt="logo" id="logo" onClick={() => navigate('/')}
            src={getLogoSource()}
            onMouseOver={e => (e.currentTarget.src = getLogoSourceHover())}
            onMouseOut={e => (e.currentTarget.src = getLogoSource())}
        />
    )
}
