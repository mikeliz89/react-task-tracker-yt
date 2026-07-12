

//user


import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION, ICONS } from '../../utils/Constants';
import Button from '../Buttons/Button';
import Icon from '../Icon';

import LeftWrapper from './LeftWrapper';
import Logo from './Logo';
import RightWrapper from './RightWrapper';

export default function Header() {

    //navigation
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const notificationCount = Number(sessionStorage.getItem('notificationCount') || 0);

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
                            <button
                                type='button'
                                className='header-notification-button'
                                title='Notifications'
                                aria-label={`Notifications ${notificationCount}`}
                            >
                                <Icon name={ICONS.GLOBE} />
                                <span className='header-notification-badge'>
                                    {notificationCount > 99 ? '99+' : notificationCount}
                                </span>
                            </button>
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



