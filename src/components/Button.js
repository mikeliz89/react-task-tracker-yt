import PropTypes from 'prop-types'

const Button = ({color, text}) => {

    const onClick = () => {
        console.log('click')
    }

    return (
        <div>
            <button onClick={onClick} style={{backgroundColor:color}} className='btn'>{text}</button>
        </div>
    )
}

Button.defaultProps = {
    color: 'steelblue'
}

Button.propTypes = {
    text: PropTypes.string,
    color: PropTypes.string
}

export default Button
