//https://fontawesome.com/v5/docs/web/use-with/react

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import { COLORS } from '../utils/Constants';

export default function Icon({ name, color, className, onClick, fontSize, cursor, style }) {
    return (
        <>
            {name &&
                <FontAwesomeIcon icon={name} color={color}
                    className={className} onClick={onClick}
                    fontSize={fontSize} cursor={cursor}
                    style={style} />
            }
            {name && ' '}
        </>
    )
}

Icon.defaultProps = {
    name: '',
    color: COLORS.GRAY,
    className: '',
    fontSize: '1em'
}

Icon.propTypes = {
    name: PropTypes.string,
    color: PropTypes.string,
    className: PropTypes.string,
    fontSize: PropTypes.string,
    style: PropTypes.object
}

