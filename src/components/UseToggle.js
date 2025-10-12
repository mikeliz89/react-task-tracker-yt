import { useState } from 'react';
import PropTypes from 'prop-types';

export const useToggle = (defaultval = false) => {
    const [status, setStatus] = useState(defaultval);

    const toggleStatus = () => setStatus((prevStatus) => !prevStatus);
    const setFalse = () => setStatus(false);
    const setTrue = () => setStatus(true);

    return { status, toggleStatus, setStatus, setFalse, setTrue };
};

useToggle.propTypes = {
    defaultval: PropTypes.bool
};