//proptypes
import PropTypes from 'prop-types';
//auth
import { useAuth } from '../../contexts/AuthContext';
import Logout from '../Auth/Logout';
//react
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
//language
import Language from '../Language/Language';
//profile
import MyProfile from '../MyProfile/MyProfile';
//utils
import * as Constants from '../../utils/Constants';

const Header = ({ title }) => {

    //navigation
    const navigate = useNavigate();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_HEADER, { keyPrefix: Constants.TRANSLATION_HEADER });

    //user
    const { currentUser } = useAuth()

    return (
        <div className="headerbox">
            <header className="header">
                <h1 className='deleteBtn' onClick={() => navigate('/')}>{title}</h1>
            </header>
            <p className="loggedin-user">
                {currentUser && t('header_logged_in_as_text') + currentUser.email}
            </p>
            <Row>
                <ButtonGroup>
                    <Language />
                    {currentUser && <MyProfile />}
                    {currentUser && <Logout />}
                </ButtonGroup>
            </Row>
        </div>
    )
}

Header.defaultProps = {
    title: 'default header title'
}

Header.propTypes = {
    title: PropTypes.string.isRequired
}

//CSS in JS
// const headingStyle = {
//     color: 'red', backgroundColor: 'black'
// }

export default Header
