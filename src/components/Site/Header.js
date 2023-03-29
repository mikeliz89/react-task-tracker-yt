import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Constants from '../../utils/Constants';
import RightWrapper from './RightWrapper';
import Button from '../Buttons/Button';
import LeftWrapper from './LeftWrapper';
import { Col, Row } from 'react-bootstrap';
import Logo from './Logo';

const Header = () => {

    //navigation
    const navigate = useNavigate();

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_HEADER, { keyPrefix: Constants.TRANSLATION_HEADER });

    //user
    const { currentUser } = useAuth();

    //location
    const location = useLocation();

    const navigateTo = () => {
        if (location.pathname !== Constants.NAVIGATION_MANAGE_MY_PROFILE) {
            navigate(Constants.NAVIGATION_MANAGE_MY_PROFILE);
        }
    }

    return (
        <div className="headerContainer">
            <Row>
                <Col>
                    <LeftWrapper>
                        <Logo />
                    </LeftWrapper>
                    <RightWrapper>
                        <Button
                            iconName={Constants.ICON_GEAR}
                            onClick={() => navigateTo()} />
                    </RightWrapper>
                </Col>
            </Row>
            <Row className="loggedin-user">
                <Col>
                    <RightWrapper>
                        {currentUser && '' + currentUser.email}
                    </RightWrapper>
                </Col>
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
