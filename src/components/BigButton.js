import PropTypes from 'prop-types'

const BigButton = ({ color, textcolor, text, onClick, textBackgroundColor, imageName, comingsoon }) => {

    const background = `/images/${imageName}`;
    return (
        <div style={{ backgroundImage: `url(${background})` }}>
            <button
                onClick={onClick}
                style={imageName === "" ?
                    { backgroundColor: color, color: textcolor } :
                    { backgroundColor: 'rgba(0, 0, 0, 0)', color: textcolor }}
                className='bigbtn'>
                <div style={{ backgroundColor: textBackgroundColor, paddingTop: '5px', paddingBottom: '5px' }}>
                    <span style={comingsoon ? {color:'gray'} : {}}>{text}</span>
                    {comingsoon && <div style={{ color: 'gray' }}>Coming soon!</div>}
                </div>
            </button>
        </div>
    )
}

BigButton.defaultProps = {
    color: 'steelblue',
    text: '',
    textcolor: 'white',
    textBackgroundColor: 'rgba(255, 255, 255, 0.5)',
    imageName: ''
}

BigButton.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string,
    textcolor: PropTypes.string,
    textBackgroundColor: PropTypes.string,
    imageName: PropTypes.string,
    onClick: PropTypes.func
}

export default BigButton
