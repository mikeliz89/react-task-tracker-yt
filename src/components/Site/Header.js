
//user
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { onValue, ref } from 'firebase/database';

import { db } from '../../firebase-config';
import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION, ICONS, DB } from '../../utils/Constants';
import Button from '../Buttons/Button';
import Icon from '../Icon';

import LeftWrapper from './LeftWrapper';
import Logo from './Logo';
import RightWrapper from './RightWrapper';

const BIRTHDAY_LOOKAHEAD_DAYS = 7;

function getDaysUntilNextBirthday(birthdayValue, now = new Date()) {
    if (!birthdayValue) {
        return null;
    }

    const birthdayDate = new Date(birthdayValue);
    if (Number.isNaN(birthdayDate.getTime())) {
        return null;
    }

    const currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);

    const nextBirthday = new Date(currentDate);
    nextBirthday.setMonth(birthdayDate.getMonth(), birthdayDate.getDate());
    nextBirthday.setHours(0, 0, 0, 0);

    if (nextBirthday < currentDate) {
        nextBirthday.setFullYear(currentDate.getFullYear() + 1);
    }

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.round((nextBirthday - currentDate) / millisecondsPerDay);
}

export default function Header() {

    //navigation
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [notificationCount, setNotificationCount] = useState(0);

    //location
    const location = useLocation();

    const navigateTo = () => {
        if (location.pathname !== NAVIGATION.MANAGE_MY_PROFILE) {
            navigate(NAVIGATION.MANAGE_MY_PROFILE);
        }
    }

    useEffect(() => {
        if (!currentUser) {
            setNotificationCount(0);
            return;
        }

        const peopleUnsubscribe = onValue(ref(db, DB.PEOPLE), (snapshot) => {
            const people = snapshot.val();
            let count = 0;

            if (people && typeof people === 'object') {
                Object.values(people).forEach((person) => {
                    if (!person || typeof person !== 'object') {
                        return;
                    }

                    const daysUntilBirthday = getDaysUntilNextBirthday(person.birthday);
                    if (daysUntilBirthday != null && daysUntilBirthday <= BIRTHDAY_LOOKAHEAD_DAYS) {
                        count += 1;
                    }
                });
            }

            setNotificationCount(count);
        });

        return () => {
            peopleUnsubscribe();
        };
    }, [currentUser]);

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



