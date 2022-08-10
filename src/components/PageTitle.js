//proptypes
import PropTypes from 'prop-types';
//icon
import Icon from './Icon';

function PageTitle({ title, iconName, iconColor }) {
    return (
        <h3 className='page-title'>
            <Icon name={iconName} color={iconColor} />
            {title}
        </h3>
    )
}

PageTitle.defaultProps = {
    title: '',
    //Icons
    iconName: '',
    iconColor: ''
}

PageTitle.propTypes = {
    title: PropTypes.string,
    //icons
    iconName: PropTypes.string,
    iconColor: PropTypes.string
}

export default PageTitle