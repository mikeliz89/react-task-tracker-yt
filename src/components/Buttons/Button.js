import PropTypes from 'prop-types';
import Icon from '../Icon';

const Button = ({ disabled, color, text, onClick, className,
    secondIconName, type, iconName, iconColor, disableStyle,
    title
}) => {
    return (
        <button
            title={title}
            disabled={disabled}
            type={type}
            onClick={onClick}
            //jos class saveBtn niin ei styleä
            style={className.includes('saveBtn') || disableStyle ? {} : { backgroundColor: color, color: 'white' }}
            className={className}>
            <Icon name={iconName} color={iconColor} />
            <Icon name={secondIconName} color={iconColor} />
            {text}</button>
    )
}

Button.defaultProps = {
    //strings
    color: 'steelblue',
    textcolor: 'white',
    className: 'btn',
    title: '',
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
    title: PropTypes.string,
    text: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
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

export default Button
