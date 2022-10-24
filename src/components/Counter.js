import CenterWrapper from "./Site/CenterWrapper";
import PropTypes from 'prop-types';

function Counter({ counter, list, originalList, text }) {

    const getText = () => {
        if (text === undefined || text == '') {
            return '';
        } else {
            return text + ':';
        }
    }

    const getCounterText = () => {
        if (originalList === undefined || originalList === null) {
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

export default Counter