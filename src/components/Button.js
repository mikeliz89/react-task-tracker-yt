import PropTypes from 'prop-types'
import { FaArrowLeft } from 'react-icons/fa'

const Button = ({color, text, onClick, className, showIcon}) => {
    return (
        <button 
        onClick={onClick}
        style={{backgroundColor:color, color:'white'}}
        className={className}>
        {
        showIcon &&
        <span>
            <FaArrowLeft style={{color: 'white', cursor: 'pointer', marginRight:'5px', marginBottom: '5px' }} />
        </span>
        }
        {text}</button>
    )
}

Button.defaultProps = {
    color: 'steelblue',
    textcolor: 'white',
    className: 'btn',
    showIcon: false
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    showIcon: PropTypes.bool,
    onClick: PropTypes.func
}

export default Button
