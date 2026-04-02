
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { useTheme } from '../../contexts/ThemeContext';
import { ICONS, COLORS, THEMES } from '../../utils/Constants';

export default function Logo() {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const logoColor = theme === THEMES.DARK ? COLORS.WHITE : COLORS.BLACK;

    return (
        <div
            id="logo"
            onClick={() => navigate('/')}
            style={{
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                lineHeight: 1,
                textAlign: 'left',
                color: logoColor
            }}
        >
            {/* <Icon name={ICONS.LIST_ALT} color={logoColor} fontSize="1.8rem" /> */}
            <div>
                <div style={{ fontSize: '1.9rem', fontWeight: '700', color: logoColor }}>LifeSaver</div>
                <div style={{ fontSize: '1rem', fontWeight: '400', color: logoColor, marginLeft: '0.3rem' }}>App</div>
            </div>
        </div>
    );
}
