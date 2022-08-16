//proptypes
import PropTypes from 'prop-types';
//react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//https://fontawesome.com/v5/docs/web/use-with/react

function Icon({ name, color, className, onClick, fontSize, cursor }) {
    return (
        <>
            {name && <FontAwesomeIcon icon={name} color={color} className={className} onClick={onClick} fontSize={fontSize} cursor={cursor} />}
            {name && ' '}
        </>
    )
}

Icon.defaultProps = {
    name: '',
    color: 'gray',
    className: '',
    fontSize: '1em'
}

Icon.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    fontSize: PropTypes.string
}

export default Icon