import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import { useTheme } from '../../contexts/ThemeContext';
import { /* ICONS, */ COLORS, THEMES } from '../../utils/Constants';
//import Icon from '../Icon';

export default function Logo() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const logoColor = theme === THEMES.DARK ? COLORS.WHITE : COLORS.BLACK;
    const [isHovered, setIsHovered] = useState(false);
    const activeLogoColor = isHovered ? 'orange' : logoColor;

    return (
        <div
            id="logo"
            onClick={() => navigate('/')}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                lineHeight: 1,
                textAlign: 'left',
                color: activeLogoColor
            }}
        >
            {/* <Icon name={ICONS.LIST_ALT} color={activeLogoColor} fontSize="1.8rem" /> */}
            <div>
                <div style={{ fontSize: '1.9rem', fontWeight: '700', color: activeLogoColor }}>LifeSaver</div>
                <div style={{ fontSize: '1rem', fontWeight: '400', color: activeLogoColor, marginLeft: '0.3rem' }}>App</div>
            </div>
        </div>
    );
}



