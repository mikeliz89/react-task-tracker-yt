import PropTypes from 'prop-types';
import Icon from '../Icon';

export default function PageTitle({ title, iconName, iconColor, isSubTitle }) {
    return (
        <>
            {
                !isSubTitle &&
                <h3 className='page-title'>
                    <Icon name={iconName} color={iconColor} />
                    {title}
                </h3>
            }
            {
                isSubTitle &&
                <h4 className='page-title'>
                    <Icon name={iconName} color={iconColor} />
                    {title}
                </h4>
            }
        </>
    )
}

PageTitle.defaultProps = {
    title: '',
    isSubTitle: false,
    //Icons
    iconName: '',
    iconColor: ''
}

PageTitle.propTypes = {
    title: PropTypes.string,
    isSubTitle: PropTypes.bool,
    //icons
    iconName: PropTypes.string,
    iconColor: PropTypes.string
}