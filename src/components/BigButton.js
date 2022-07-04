import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const BigButton = ({ color, textcolor, text, onClick, textBackgroundColor, imageName, comingsoon }) => {

    const { t } = useTranslation();

    const background = `/images/${imageName}`;

    return (
        <div style={{ backgroundImage: `url(${background})` }}>
            <button
                onClick={onClick}
                style={imageName === "" ?
                    { backgroundColor: color, color: textcolor } :
                    { backgroundColor: 'rgba(0, 0, 0, 0)', color: textcolor }}
                className='bigbtn'>
                <div style={{ backgroundColor: textBackgroundColor, paddingTop: '5px', paddingBottom: '5px' }}>
                    <span style={comingsoon ? {color:'gray'} : {}}><b>{text}</b></span>
                    {comingsoon && <div style={{ color: 'gray' }}>{t('coming_soon')}</div>}
                </div>
            </button>
        </div>
    )
}

BigButton.defaultProps = {
    color: 'steelblue',
    text: '',
    textcolor: 'white',
    textBackgroundColor: 'rgba(255, 255, 255, 0.5)',
    imageName: '',
    comingsoon: false
}

BigButton.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    textcolor: PropTypes.string,
    textBackgroundColor: PropTypes.string,
    imageName: PropTypes.string,
    comingsoon: PropTypes.bool,
    onClick: PropTypes.func
}

export default BigButton
