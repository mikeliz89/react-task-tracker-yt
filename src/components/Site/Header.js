
//user
import { useEffect, useRef, useState } from 'react';
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
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationWrapperRef = useRef(null);

    //location
    const location = useLocation();

    const navigateTo = () => {
        if (location.pathname !== NAVIGATION.MANAGE_MY_PROFILE) {
            navigate(NAVIGATION.MANAGE_MY_PROFILE);
        }
    }

    const openPersonDetails = (personId) => {
        setShowNotifications(false);
        navigate(`${NAVIGATION.PERSON}/${personId}`);
    };

    useEffect(() => {
        if (!currentUser) {
            setNotificationCount(0);
            setUpcomingBirthdays([]);
            return;
        }

        const peopleUnsubscribe = onValue(ref(db, DB.PEOPLE), (snapshot) => {
            const people = snapshot.val();
            const upcoming = [];

            if (people && typeof people === 'object') {
                Object.entries(people).forEach(([id, person]) => {
                    if (!person || typeof person !== 'object') {
                        return;
                    }

                    const daysUntilBirthday = getDaysUntilNextBirthday(person.birthday);
                    if (daysUntilBirthday != null && daysUntilBirthday <= BIRTHDAY_LOOKAHEAD_DAYS) {
                        upcoming.push({
                            id,
                            name: person.name || '-',
                            birthday: person.birthday,
                            daysUntilBirthday,
                        });
                    }
                });
            }

            upcoming.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
            setUpcomingBirthdays(upcoming);
            setNotificationCount(upcoming.length);
        });

        return () => {
            peopleUnsubscribe();
        };
    }, [currentUser]);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!notificationWrapperRef.current) {
                return;
            }

            if (!notificationWrapperRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleDocumentClick);
        return () => {
            document.removeEventListener('mousedown', handleDocumentClick);
        };
    }, []);

    useEffect(() => {
        setShowNotifications(false);
    }, [location.pathname]);

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
                        {currentUser && (
                            <div className='header-notification-wrap' ref={notificationWrapperRef}>
                                <button
                                    type='button'
                                    className='header-notification-button'
                                    title='Ilmoitukset'
                                    aria-label={`Notifications ${notificationCount}`}
                                    aria-expanded={showNotifications}
                                    onClick={() => setShowNotifications((prev) => !prev)}
                                >
                                    <Icon name={ICONS.GLOBE} />
                                    <span className='header-notification-badge'>
                                        {notificationCount > 99 ? '99+' : notificationCount}
                                    </span>
                                </button>

                                {showNotifications && (
                                    <div className='header-notification-panel'>
                                        <h6 className='header-notification-title'>Ilmoitukset</h6>

                                        {upcomingBirthdays.length > 0 ? (
                                            <div className='header-notification-list'>
                                                {upcomingBirthdays.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type='button'
                                                        className='header-notification-item'
                                                        onClick={() => openPersonDetails(item.id)}
                                                    >
                                                        <span className='header-notification-item-name'>{item.name}</span>
                                                        <span className='header-notification-item-meta'>
                                                            {item.daysUntilBirthday === 0 ? 'Synttärit tänään' : `Synttärit ${item.daysUntilBirthday} pv päästä`}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className='header-notification-empty'>Ei uusia ilmoituksia</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
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



