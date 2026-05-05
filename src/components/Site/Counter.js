import PropTypes from 'prop-types';

import CenterWrapper from "./CenterWrapper";

export default function Counter({ counter, list, originalList, text }) {

    //console.log(list)

    const getText = () => {
        if (text === undefined || text === '') {
            return '';
        } else {
            return text + ':';
        }
    }

    const getCounterText = () => {
        if (
            originalList === undefined || originalList === null ||
            list === undefined || list === null
        ) {
            return;
        }
        return list.length < originalList.length ? list.length + '/' + counter : counter + '';
    }

    return (
        <CenterWrapper>
            {getText()} {getCounterText()}
        </CenterWrapper>
    )
}

Counter.defaultProps = {
    //strings
    text: '',
}

Counter.propTypes = {
    //strings
    text: PropTypes.string,
    //numbers
    counter: PropTypes.number
}


