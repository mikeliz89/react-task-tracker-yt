import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Icon from '../Icon';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

export default function BigButton({ color, textcolor, text, onClick, textBackgroundColor,
    imageName, comingsoon, iconName, iconColor }) {

    //translation
    const { t } = useTranslation();
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, {keyPrefix: TRANSLATION.COMMON});

    //images
    const background = `/images/${imageName}`;

    return (
        <div style={{ backgroundImage: `url(${background})` }}>
            <button
                onClick={onClick}
                style={imageName === "" ?
                    { backgroundColor: color, color: textcolor } :
                    { backgroundColor: 'rgba(0, 0, 0, 0)', color: textcolor }}
                className='bigBtn'>
                <div style={{ backgroundColor: textBackgroundColor, paddingTop: '5px', paddingBottom: '5px' }}>
                    <span style={comingsoon ? { color: COLORS.GRAY } : {}}>
                        <b>
                            <Icon name={iconName} color={iconColor} />
                            {text}
                        </b>
                    </span>
                    {comingsoon && <div style={{ color: COLORS.GRAY }}>{t('coming_soon')}</div>}
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