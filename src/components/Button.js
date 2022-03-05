import PropTypes from 'prop-types'
import { FaArrowLeft, FaArchive } from 'react-icons/fa'

const Button = ({color, text, onClick, className, showIconArrowLeft, showIconArchive}) => {
    return (
        <button 
        onClick={onClick}
        style={{backgroundColor:color, color:'white'}}
        className={className}>
        {
        showIconArrowLeft &&
        <span>
            <FaArrowLeft style={{color: 'white', cursor: 'pointer', marginRight:'5px', marginBottom: '5px' }} />
        </span>
        }
        {
        showIconArchive &&
        <span>
            <FaArchive style={{color: 'white', cursor: 'pointer', marginRight:'5px', marginBottom: '5px' }} />
        </span>
        }
        {text}</button>
    )
}

Button.defaultProps = {
    color: 'steelblue',
    textcolor: 'white',
    className: 'btn',
    showIconArrowLeft: false,
    showIconArchive: false
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    showIconArrowLeft: PropTypes.bool,
    showIconArchive: PropTypes.bool,
    onClick: PropTypes.func
}

export default Button
