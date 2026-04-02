import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import { COLORS, THEMES } from '../../utils/Constants';
import { useTheme } from '../../contexts/ThemeContext';

export default function BigButton({ color, textcolor, text, onClick,
    imageName, comingsoon, iconName, iconColor }) {
    const { theme } = useTheme();

    //translation
    const { t } = useTranslation();

    //images
    const background = `/images/${imageName}`;

    const buttonStyle = {
        '--bigBtn-bg': imageName === '' ? color : 'transparent',
        '--bigBtn-text': COLORS.WHITE,
        color: COLORS.WHITE,
        backgroundColor: imageName === ''
            ? color
            : theme === THEMES.DARK
                ? 'rgba(0, 0, 0, 0.35)'
                : 'rgba(0, 0, 0, 0.20)'
    };

    const iconColorValue = COLORS.WHITE;

    return (
        <div style={{ backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px', overflow: 'hidden' }}>
            <button
                onClick={onClick}
                style={buttonStyle}
                className={`bigBtn ${comingsoon ? 'bigBtnComingSoon' : ''}`}>
                <div className="bigBtnContent">
                    <span className={`bigBtnText ${comingsoon ? 'comingsoon' : ''}`}>
                        <b>
                            <Icon name={iconName} color={iconColorValue} className="bigBtnIcon" />
                            {text}
                        </b>
                    </span>
                    {comingsoon && <div className="bigBtnComingSoonText">{t('coming_soon')}</div>}
                </div>
            </button>
        </div>
    )
}

BigButton.defaultProps = {
    color: COLORS.STEELBLUE,
    text: '',
    textcolor: COLORS.WHITE,
    textBackgroundColor: 'rgba(255, 255, 255, 0.5)',
    imageName: '',
    iconName: '',
    iconColor: '',
    comingsoon: false
}

BigButton.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    textcolor: PropTypes.string,
    textBackgroundColor: PropTypes.string,
    imageName: PropTypes.string,
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    comingsoon: PropTypes.bool,
    onClick: PropTypes.func
}