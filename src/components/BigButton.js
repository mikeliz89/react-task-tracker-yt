import PropTypes from 'prop-types'

const BigButton = ({color, textcolor, text, onClick, textBackgroundColor, imageName}) => {

    const background = `/images/${imageName}`;
    return (
        <div style={{ backgroundImage: `url(${background})` }}>
            <button 
            onClick={ onClick }
            style={ imageName == "" ? 
                { backgroundColor:color, color:textcolor } : 
                { backgroundColor: 'rgba(0, 0, 0, 0)', color:textcolor} }
            className='bigbtn'>
                <div style={{backgroundColor: textBackgroundColor, paddingTop:'5px', paddingBottom: '5px'}}>{text}</div>
            </button>
        </div>
    )
}

BigButton.defaultProps = {
    color: 'steelblue',
    textcolor: 'white',
    imageName: '',
    textBackgroundColor: 'rgba(255, 255, 255, 0.5)'
}

BigButton.propTypes = {
    text: PropTypes.string,
    textcolor: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func
}

export default BigButton
