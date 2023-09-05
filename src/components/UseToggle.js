import { useState } from 'react';
import PropTypes from 'prop-types';

export const useToggle = (defaultval) => {

    const [status, setStatus] = useState(defaultval);
    const toggleStatus = () => setStatus((prevStatus) => !prevStatus);

    return { status, toggleStatus, setStatus };
};

useToggle.defaultProps = {
    defaultval: false
}

useToggle.propTypes = {
    defaultval: PropTypes.bool
}
