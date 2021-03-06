import PropTypes from 'prop-types';
import {
    FaArrowLeft, FaArchive, FaSignOutAlt,
    FaEdit, FaPlus, FaCarrot, FaHourglass,
    FaWeight, FaLemon
} from 'react-icons/fa';

const Button = ({ disabled, color, text, onClick, className,
    showIconArrowLeft, showIconArchive, showIconLogout, showIconEdit, showIconAdd,
    showIconCarrot, showIconHourGlass, showIconWeight, showIconLemon,
    type
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
                showIconArrowLeft &&
                <span>
                    <FaArrowLeft style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconArchive &&
                <span>
                    <FaArchive style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconLogout &&
                <span>
                    <FaSignOutAlt style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
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
                showIconWeight &&
                <span>
                    <FaWeight style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {
                showIconLemon &&
                <span>
                    <FaLemon style={{ color: 'white', cursor: 'pointer', marginRight: '5px', marginBottom: '5px' }} />
                </span>
            }
            {text}</button>
    )
}

Button.defaultProps = {
    //strings
    color: 'steelblue',
    textcolor: 'white',
    className: 'btn',
    //icons
    showIconArrowLeft: false,
    showIconArchive: false,
    showIconLogout: false,
    showIconEdit: false,
    showIconAdd: false,
    showIconCarrot: false,
    showIconHourGlass: false,
    showIconWeight: false,
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
    showIconArrowLeft: PropTypes.bool,
    showIconArchive: PropTypes.bool,
    showIconLogout: PropTypes.bool,
    showIconEdit: PropTypes.bool,
    showIconAdd: PropTypes.bool,
    showIconCarrot: PropTypes.bool,
    showIconHourGlass: PropTypes.bool,
    showIconWeight: PropTypes.bool,
    showIconLemon: PropTypes.bool,
    //other
    disabled: PropTypes.bool,
    onClick: PropTypes.func
}

export default Button
