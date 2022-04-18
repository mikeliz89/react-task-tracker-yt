import PropTypes from 'prop-types';
import { useAuth } from '../contexts/AuthContext';
import  Logout  from '../components/Logout';
import { useTranslation } from 'react-i18next';
import Language from '../components/Language/Language';
import MyProfile from '../components/MyProfile/MyProfile';
import { Row, ButtonGroup } from 'react-bootstrap';

const Header = ({title}) => {

    const { t } = useTranslation();
    const { currentUser } = useAuth()

    return (
        <div className="headerbox">
            <header className="header">
                <h1>{title}</h1>
            </header>
            <p className="loggedin-user">
                { currentUser && t('header_logged_in_as_text') + currentUser.email }
            </p>
            <Row>
                <ButtonGroup>
                    <Language />
                    { currentUser && <MyProfile /> }
                    { currentUser && <Logout /> }
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
