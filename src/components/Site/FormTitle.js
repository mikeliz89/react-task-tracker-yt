import PropTypes from 'prop-types';
import Icon from '../Icon';

export default function FormTitle({ iconName, title }) {
    return (
        <h5 style={{ marginTop: '10px' }}>
            {
                <Icon name={iconName} />
            }
            {title}
        </h5>
    )
}

FormTitle.defaultProps = {
    //strings
    title: '',
    //icons
    iconName: ''
}

FormTitle.propTypes = {
    //strings
    title: PropTypes.string,
    //icons
    iconName: PropTypes.string
}