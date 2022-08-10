//proptypes
import PropTypes from 'prop-types';
//react
import {
    FaEdit, FaPlus, FaCarrot, FaHourglass,
    FaLemon
} from 'react-icons/fa';
import Icon from './Icon';

const Button = ({ disabled, color, text, onClick, className,
    showIconEdit, showIconAdd, showIconCarrot, showIconHourGlass, showIconLemon,
    type, iconName, iconColor
}) => {
    return (
        <button
            disabled={disabled}
            type={type}
            onClick={onClick}
            //jos class saveBtn niin ei styleä
            style={className.includes('saveBtn') ? {} : { backgroundColor: color, color: 'white' }}
            className={className}>
            {
                showIconEdit &&
                <span>
                    <FaEdit style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconAdd &&
                <span>
                    <FaPlus style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconCarrot &&
                <span>
                    <FaCarrot style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconHourGlass &&
                <span>
                    <FaHourglass style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconLemon &&
                <span>
                    <FaLemon style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            <Icon name={iconName} color={iconColor} />
            {text}</button>
    )
}

Button.defaultProps = {
    //strings
    color: 'steelblue',
    textcolor: 'white',
    className: 'btn',
    //icons
    iconName: '',
    iconColor: '',
    showIconEdit: false,
    showIconAdd: false,
    showIconCarrot: false,
    showIconHourGlass: false,
    showIconLemon: false,
    //other
    disabled: false
}

Button.propTypes = {
    //strings
    text: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    type: PropTypes.string,
    //icons
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    showIconEdit: PropTypes.bool,
    showIconAdd: PropTypes.bool,
    showIconCarrot: PropTypes.bool,
    showIconHourGlass: PropTypes.bool,
    showIconLemon: PropTypes.bool,
    //other
    disabled: PropTypes.bool,
    onClick: PropTypes.func
}

export default Button
