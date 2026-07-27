
//user
import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

import { subscribeToFirebaseAsArray } from '../../datatier/datatier';
import { useAuth } from '../../contexts/AuthContext';
import { NAVIGATION, ICONS, DB, TRANSLATION } from '../../utils/Constants';
import Button from '../Buttons/Button';
import Icon from '../Icon';

import LeftWrapper from './LeftWrapper';
import Logo from './Logo';
import RightWrapper from './RightWrapper';

const BIRTHDAY_LOOKAHEAD_DAYS = 7;
const REMINDER_LOOKAHEAD_DAYS = 7;

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

function getDaysUntilReminder(reminderDateValue, now = new Date()) {
    if (!reminderDateValue) {
        return null;
    }

    const reminderDate = new Date(reminderDateValue);
    if (Number.isNaN(reminderDate.getTime())) {
        return null;
    }

    const currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    reminderDate.setHours(0, 0, 0, 0);

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.round((reminderDate - currentDate) / millisecondsPerDay);
}

export default function Header() {

    //navigation
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const [notificationCount, setNotificationCount] = useState(0);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState([]);
    const [upcomingReminders, setUpcomingReminders] = useState([]);
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

    const openRemindersPage = () => {
        setShowNotifications(false);
        navigate(NAVIGATION.MANAGE_REMINDERS);
    };

    useEffect(() => {
        if (!currentUser) {
            setNotificationCount(0);
            setUpcomingBirthdays([]);
            setUpcomingReminders([]);
            return;
        }

        const peopleUnsubscribe = subscribeToFirebaseAsArray(DB.PEOPLE, (people) => {
            const upcoming = [];

            if (people && Array.isArray(people)) {
                people.forEach((person) => {
                    if (!person || typeof person !== 'object') {
                        return;
                    }

                    const daysUntilBirthday = getDaysUntilNextBirthday(person.birthday);
                    if (daysUntilBirthday != null && daysUntilBirthday <= BIRTHDAY_LOOKAHEAD_DAYS) {
                        upcoming.push({
                            id: person.id,
                            name: person.name || '-',
                            birthday: person.birthday,
                            daysUntilBirthday,
                        });
                    }
                });
            }

            upcoming.sort((a, b) => a.daysUntilBirthday - b.daysUntilBirthday);
            setUpcomingBirthdays(upcoming);
        });

        const remindersUnsubscribe = subscribeToFirebaseAsArray(DB.REMINDERS, (reminders) => {
            const upcoming = [];

            if (reminders && Array.isArray(reminders)) {
                reminders.forEach((reminder) => {
                    if (!reminder || typeof reminder !== 'object') {
                        return;
                    }

                    if (!currentUser?.uid) {
                        return;
                    }

                    if (reminder.userId !== currentUser.uid) {
                        return;
                    }

                    const daysUntilReminder = getDaysUntilReminder(reminder.date);
                    if (daysUntilReminder == null) {
                        return;
                    }

                    if (daysUntilReminder <= REMINDER_LOOKAHEAD_DAYS && daysUntilReminder >= -REMINDER_LOOKAHEAD_DAYS) {
                        upcoming.push({
                            id: reminder.id,
                            name: reminder.name || '-',
                            date: reminder.date,
                            daysUntilReminder,
                        });
                    }
                });
            }

            upcoming.sort((a, b) => a.daysUntilReminder - b.daysUntilReminder);
            setUpcomingReminders(upcoming);
        });

        return () => {
            peopleUnsubscribe();
            remindersUnsubscribe();
        };
    }, [currentUser]);

    useEffect(() => {
        setNotificationCount(upcomingBirthdays.length + upcomingReminders.length);
    }, [upcomingBirthdays, upcomingReminders]);

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
                                    title={tCommon('notifications.title')}
                                    aria-label={tCommon('notifications.aria_label', { count: notificationCount })}
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
                                        <h6 className='header-notification-title'>{tCommon('notifications.title')}</h6>

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
                                                            {item.daysUntilBirthday === 0
                                                                ? tCommon('notifications.birthday_today')
                                                                : tCommon('notifications.birthday_in_days', { days: item.daysUntilBirthday })}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : null}

                                        {upcomingReminders.length > 0 ? (
                                            <div className='header-notification-list'>
                                                {upcomingReminders.map((item) => (
                                                    <button
                                                        key={item.id}
                                                        type='button'
                                                        className='header-notification-item'
                                                        onClick={openRemindersPage}
                                                    >
                                                        <span className='header-notification-item-name'>{item.name}</span>
                                                        <span className='header-notification-item-meta'>
                                                            {item.daysUntilReminder === 0
                                                                ? tCommon('notifications.reminder_today')
                                                                : item.daysUntilReminder > 0
                                                                    ? tCommon('notifications.reminder_in_days', { days: item.daysUntilReminder })
                                                                    : tCommon('notifications.reminder_overdue_days', { days: Math.abs(item.daysUntilReminder) })}
                                                        </span>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : null}

                                        {upcomingBirthdays.length === 0 && upcomingReminders.length === 0 ? (
                                            <p className='header-notification-empty'>{tCommon('notifications.empty')}</p>
                                        ) : null}
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



