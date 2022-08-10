//proptypes
import PropTypes from 'prop-types';
//react
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//https://fontawesome.com/v5/docs/web/use-with/react

function Icon({ name, color }) {
    return (
        <>
            {name && <FontAwesomeIcon icon={name} color={color} />}
            {name && ' '}
        </>
    )
}

Icon.defaultProps = {
    name: '',
    color: ''
}

Icon.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string
}

export default Icon