import PropTypes from 'prop-types'

const BigButton = ({color, textcolor, text, onClick, imageName}) => {

    const background = `/images/${imageName}`;
    return (
        <div style={{ backgroundImage: `url(${background})` }}>
            <button 
            onClick = {onClick}
            style={ imageName == "" ? { backgroundColor:color, color:textcolor } : {backgroundColor: 'rgba(0, 0, 0, 0)'} }
            className='bigbtn'>{text}</button>
        </div>
    )
}

BigButton.defaultProps = {
    color: 'steelblue',
    textcolor: 'white',
    imageName: ''
}

BigButton.propTypes = {
    text: PropTypes.string,
    textcolor: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func
}

export default BigButton
