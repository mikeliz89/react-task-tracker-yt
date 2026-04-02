
import { useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { ICONS, COLORS } from '../../utils/Constants';

export default function Logo() {
    const navigate = useNavigate();

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
                textAlign: 'left'
            }}
        >
            <Icon name={ICONS.LIST_ALT} color={COLORS.WHITE} fontSize="1.8rem" />
            <div>
                <div style={{ fontSize: '1.9rem', fontWeight: '700' }}>LifeSaver</div>
                <div style={{ fontSize: '1rem', fontWeight: '400' }}>App</div>
            </div>
        </div>
    );
}
