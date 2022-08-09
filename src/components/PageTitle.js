//proptypes
import PropTypes from 'prop-types';
//react
import { FaCocktail, FaGlassMartini, FaUtensils, FaListAlt } from 'react-icons/fa';

function PageTitle({ title, showIconMartiniGlass, showIconUtentils,
    showIconListAlt, showIconCocktail }) {
    return (
        <h3 className='page-title'>
            {showIconMartiniGlass &&
                <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} />
            }
            {showIconCocktail &&
                <FaCocktail style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} />
            }
            {
                showIconUtentils &&
                <FaUtensils style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} />
            }
            {
                showIconListAlt &&
                <FaListAlt style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} />
            }
            {title}
        </h3>
    )
}

PageTitle.defaultProps = {
    title: '',
    //Icons
    showIconMartiniGlass: false,
    showIconUtentils: false,
    showIconListAlt: false,
    showIconCocktail: false
}

PageTitle.propTypes = {
    title: PropTypes.string,
    //icons
    showIconMartiniGlass: PropTypes.bool,
    showIconUtentils: PropTypes.bool,
    showIconListAlt: PropTypes.bool,
    showIconCocktail: PropTypes.bool
}

export default PageTitle