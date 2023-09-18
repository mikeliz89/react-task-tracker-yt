import PropTypes from 'prop-types';
import Icon from '../Icon';
import * as Constants from '../../utils/Constants';

export default function Button({ disabled, color, text, onClick, className,
    secondIconName, type, iconName, iconColor, disableStyle,
    title, textcolor
}) {
    return (
        <button
            title={title}
            disabled={disabled}
            type={type}
            onClick={onClick}
            //jos class saveBtn niin ei styleä
            style={className.includes('saveBtn') || disableStyle ? {} : { backgroundColor: color, color: textcolor }}
            className={className}>
            <Icon name={iconName} color={iconColor} />
            <Icon name={secondIconName} color={iconColor} />
            {text}</button>
    )
}

Button.defaultProps = {
    //strings
    color: Constants.COLOR_STEELBLUE,
    className: 'btn',
    textcolor: Constants.COLOR_WHITE,
    title: '',
    type: 'button',
    //icons
    iconName: '',
    iconColor: '',
    secondIconName: '',
    //other
    disabled: false,
    disableStyle: false
}

Button.propTypes = {
    //strings
    color: PropTypes.string,
    className: PropTypes.string,
    textcolor: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string,
    type: PropTypes.string,
    //icons
    iconName: PropTypes.string,
    iconColor: PropTypes.string,
    secondIconName: PropTypes.string,
    //other
    disabled: PropTypes.bool,
    disableStyle: PropTypes.bool,
    onClick: PropTypes.func
}
