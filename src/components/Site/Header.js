

//user


import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION, ICONS } from '../../utils/Constants';
import Button from '../Buttons/Button';

import LeftWrapper from './LeftWrapper';
import Logo from './Logo';
import RightWrapper from './RightWrapper';

export default function Header() {

    //navigation
    const navigate = useNavigate();
const { currentUser } = useAuth();

    //location
    const location = useLocation();

    const navigateTo = () => {
        if (location.pathname !== NAVIGATION.MANAGE_MY_PROFILE) {
            navigate(NAVIGATION.MANAGE_MY_PROFILE);
        }
    }

    return (
        <div className="headerContainer">
            <Row className="align-items-center">
                <Col>
                    <LeftWrapper>
                        <Logo />
                    </LeftWrapper>
                </Col>
                <Col>
                    <RightWrapper>
                        {currentUser &&
                            <span style={{ whiteSpace: 'nowrap' }}>
                                {currentUser.email}
                            </span>
                        }
                        {currentUser &&
                            <Button
                                iconName={ICONS.GEAR}
                                onClick={() => navigateTo()} />
                        }
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



