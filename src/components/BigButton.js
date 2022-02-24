import PropTypes from 'prop-types'

const BigButton = ({color, textcolor, text, onClick}) => {
    return (
        <button 
        onClick = {onClick}
        style={{backgroundColor:color, color:textcolor}}
        className='bigbtn'>{text}</button>
    )
}

BigButton.defaultProps = {
    color: 'steelblue',
    textcolor: 'white'
}

BigButton.propTypes = {
    text: PropTypes.string,
    textcolor: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func
}

export default BigButton
