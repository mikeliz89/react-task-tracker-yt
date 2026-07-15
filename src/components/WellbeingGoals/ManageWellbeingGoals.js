import { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Col, Form, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';

import { useAuth } from '../../contexts/AuthContext';
import {
    pushToFirebaseById,
    removeFromFirebaseByIdAndSubId,
    subscribeToFirebaseByIdAsArray,
    updateToFirebaseByIdAndSubId
} from '../../datatier/datatier';
import { useAlert } from '../Hooks/useAlert';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { COLORS, DB, ICONS, TRANSLATION } from '../../utils/Constants';

const FREQUENCY = {
    DAILY: 'daily',
    TWICE_DAILY: 'twice_daily',
    EVERY_OTHER_DAY: 'every_other_day',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly'
};

const VIEW_MODE = {
    WEEK: 'week',
    MONTH: 'month'
};

const getRequiredChecksForFrequency = (frequency) => {
    if (frequency === FREQUENCY.TWICE_DAILY) {
        return 2;
    }

    return 1;
};

const getOrderedGoals = (items) => {
    const sorted = [...items].sort((a, b) => {
        const aHasOrder = Number.isFinite(a.order);
        const bHasOrder = Number.isFinite(b.order);

        if (aHasOrder && bHasOrder) {
            return a.order - b.order;
        }

        if (aHasOrder) {
            return -1;
        }

        if (bHasOrder) {
            return 1;
        }

        const aCreated = a.created ?? '';
        const bCreated = b.created ?? '';
        return bCreated.localeCompare(aCreated);
    });

    return sorted.map((item, index) => ({
        ...item,
        resolvedOrder: Number.isFinite(item.order) ? item.order : index
    }));
};

const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const parseDateKey = (value) => {
    if (!value || typeof value !== 'string') {
        return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) {
        return null;
    }

    return new Date(year, month - 1, day);
};

const getLastNDays = (count) => {
    const days = [];
    const today = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d);
    }

    return days;
};

const getLast7Days = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        days.push(d);
    }

    return days;
};

const getMonthDays = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};

const isGoalDueOnDate = (goal, date) => {
    if (goal.frequency === FREQUENCY.DAILY || goal.frequency === FREQUENCY.TWICE_DAILY) {
        return true;
    }

    if (goal.frequency === FREQUENCY.WEEKLY) {
        const anchorDate = parseDateKey(goal.startDate) ?? parseDateKey(getDateKey(new Date()));
        const anchorWeekday = anchorDate ? anchorDate.getDay() : 0;
        return date.getDay() === anchorWeekday;
    }

    if (goal.frequency === FREQUENCY.MONTHLY) {
        const anchorDate = parseDateKey(goal.startDate) ?? parseDateKey(getDateKey(new Date()));
        const anchorDay = anchorDate ? anchorDate.getDate() : 1;
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
        const dueDay = Math.min(anchorDay, lastDayOfMonth);

        return date.getDate() === dueDay;
    }

    if (goal.frequency === FREQUENCY.EVERY_OTHER_DAY) {
        const anchorDate = parseDateKey(goal.startDate) ?? parseDateKey(getDateKey(new Date()));
        const dateAtMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const anchorAtMidnight = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate());
        const diffDays = Math.floor((dateAtMidnight.getTime() - anchorAtMidnight.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays % 2 === 0;
    }

    return true;
};

export default function ManageWellbeingGoals() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: 'wellbeinggoals' });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { i18n } = useTranslation();
    const { currentUser } = useAuth();

    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    const [loading, setLoading] = useState(true);
    const [goals, setGoals] = useState([]);
    const [goalName, setGoalName] = useState('');
    const [frequency, setFrequency] = useState(FREQUENCY.DAILY);
    const [editingGoalId, setEditingGoalId] = useState('');
    const [editingGoalName, setEditingGoalName] = useState('');
    const [viewMode, setViewMode] = useState(VIEW_MODE.WEEK);
    const [monthCursor, setMonthCursor] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const days = useMemo(() => {
        if (viewMode === VIEW_MODE.MONTH) {
            return getMonthDays(monthCursor);
        }

        return getLast7Days();
    }, [viewMode, monthCursor]);

    const orderedGoals = useMemo(() => getOrderedGoals(goals), [goals]);
    const successWindowDays = viewMode === VIEW_MODE.WEEK ? 7 : 30;

    const getGoalStats = (goal, windowDays) => {
        const requiredChecks = getRequiredChecksForFrequency(goal.frequency);
        const periodDays = getLastNDays(windowDays);
        const dueDays = periodDays.filter((day) => isGoalDueOnDate(goal, day));
        const totalRequiredChecks = dueDays.length * requiredChecks;
        const completedChecks = dueDays.reduce((sum, day) => {
            const checksForDay = Number(goal?.checks?.[getDateKey(day)] || 0);
            return sum + Math.min(checksForDay, requiredChecks);
        }, 0);
        const successRate = totalRequiredChecks > 0
            ? Math.round((completedChecks / totalRequiredChecks) * 100)
            : 0;

        let streak = 0;
        const today = new Date();

        // Count consecutive completed due days backwards from today.
        for (let offset = 0; offset < 365; offset++) {
            const day = new Date(today);
            day.setDate(today.getDate() - offset);

            if (!isGoalDueOnDate(goal, day)) {
                continue;
            }

            const isCompleted = Number(goal?.checks?.[getDateKey(day)] || 0) >= requiredChecks;
            if (isCompleted) {
                streak++;
            } else {
                break;
            }
        }

        let statusKey = 'status_low';
        let statusClass = 'bg-danger';

        if (successRate >= 80) {
            statusKey = 'status_good';
            statusClass = 'bg-success';
        } else if (successRate >= 50) {
            statusKey = 'status_ok';
            statusClass = 'bg-warning text-dark';
        }

        return {
            streak,
            successRate,
            statusKey,
            statusClass
        };
    };

    useEffect(() => {
        if (!currentUser?.uid) {
            setGoals([]);
            setLoading(false);
            return;
        }

        const unsubscribe = subscribeToFirebaseByIdAsArray(DB.WELLBEING_GOALS, currentUser.uid, (items) => {
            const sortedItems = [...items].sort((a, b) => {
                const aCreated = a.created ?? '';
                const bCreated = b.created ?? '';
                return bCreated.localeCompare(aCreated);
            });

            setGoals(sortedItems);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [currentUser?.uid]);

    const onSaveGoal = async (e) => {
        e.preventDefault();
        clearMessages();

        const trimmedName = goalName.trim();
        if (!trimmedName) {
            showFailure(t('validation_goal_name_required'));
            return;
        }

        if (!currentUser?.uid) {
            showFailure(t('validation_user_missing'));
            return;
        }

        try {
            await pushToFirebaseById(DB.WELLBEING_GOALS, currentUser.uid, {
                name: trimmedName,
                frequency,
                startDate: getDateKey(new Date()),
                checks: {},
                created: getCurrentDateAsJson(),
                createdBy: currentUser.email || ''
            });

            setGoalName('');
            setFrequency(FREQUENCY.DAILY);
            showSuccess(tCommon('save_success'));
        } catch (ex) {
            showFailure(tCommon('save_exception'));
            console.warn(ex);
        }
    };

    const onDeleteGoal = async (goalId) => {
        if (!currentUser?.uid) {
            return;
        }

        try {
            await removeFromFirebaseByIdAndSubId(DB.WELLBEING_GOALS, currentUser.uid, goalId);
            showSuccess(t('delete_success'));
        } catch (ex) {
            showFailure(t('delete_failed'));
            console.warn(ex);
        }
    };

    const moveGoal = async (goalId, direction) => {
        if (!currentUser?.uid) {
            showFailure(t('validation_user_missing'));
            return;
        }

        const currentIndex = orderedGoals.findIndex((goal) => goal.id === goalId);
        if (currentIndex < 0) {
            return;
        }

        const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (targetIndex < 0 || targetIndex >= orderedGoals.length) {
            return;
        }

        const currentGoal = orderedGoals[currentIndex];
        const targetGoal = orderedGoals[targetIndex];

        const currentGoalPayload = {
            ...currentGoal,
            order: targetGoal.resolvedOrder
        };
        delete currentGoalPayload.id;
        delete currentGoalPayload.resolvedOrder;

        const targetGoalPayload = {
            ...targetGoal,
            order: currentGoal.resolvedOrder
        };
        delete targetGoalPayload.id;
        delete targetGoalPayload.resolvedOrder;

        try {
            await Promise.all([
                updateToFirebaseByIdAndSubId(DB.WELLBEING_GOALS, currentUser.uid, currentGoal.id, currentGoalPayload),
                updateToFirebaseByIdAndSubId(DB.WELLBEING_GOALS, currentUser.uid, targetGoal.id, targetGoalPayload)
            ]);
        } catch (ex) {
            showFailure(tCommon('save_exception'));
            console.warn(ex);
        }
    };

    const startEditingGoalName = (goal) => {
        setEditingGoalId(goal.id);
        setEditingGoalName(goal.name || '');
        clearMessages();
    };

    const cancelEditingGoalName = () => {
        setEditingGoalId('');
        setEditingGoalName('');
    };

    const saveEditedGoalName = async (goal) => {
        const trimmedName = editingGoalName.trim();

        if (!trimmedName) {
            showFailure(t('validation_goal_name_required'));
            return;
        }

        if (!currentUser?.uid) {
            showFailure(t('validation_user_missing'));
            return;
        }

        const updatedGoal = {
            ...goal,
            name: trimmedName
        };
        delete updatedGoal.id;

        try {
            await updateToFirebaseByIdAndSubId(DB.WELLBEING_GOALS, currentUser.uid, goal.id, updatedGoal);
            cancelEditingGoalName();
            showSuccess(tCommon('save_success'));
        } catch (ex) {
            showFailure(tCommon('save_exception'));
            console.warn(ex);
        }
    };

    const onToggleCheck = async (goal, dateKey, checkboxIndex) => {
        if (!currentUser?.uid) {
            return;
        }

        const currentCount = Number(goal?.checks?.[dateKey] || 0);
        const isCurrentlyChecked = currentCount > checkboxIndex;
        const newCount = isCurrentlyChecked ? checkboxIndex : checkboxIndex + 1;

        const updatedGoal = {
            ...goal,
            checks: {
                ...(goal.checks || {}),
                [dateKey]: newCount
            }
        };
        delete updatedGoal.id;

        try {
            await updateToFirebaseByIdAndSubId(DB.WELLBEING_GOALS, currentUser.uid, goal.id, updatedGoal);
        } catch (ex) {
            showFailure(tCommon('save_exception'));
            console.warn(ex);
        }
    };

    const onQuickToggleToday = async (goal) => {
        if (!currentUser?.uid) {
            showFailure(t('validation_user_missing'));
            return;
        }

        const today = new Date();
        if (!isGoalDueOnDate(goal, today)) {
            showFailure(t('today_not_due'));
            return;
        }

        const todayKey = getDateKey(today);
        const requiredChecks = getRequiredChecksForFrequency(goal.frequency);
        const currentCount = Number(goal?.checks?.[todayKey] || 0);
        const newCount = currentCount >= requiredChecks ? 0 : requiredChecks;

        const updatedGoal = {
            ...goal,
            checks: {
                ...(goal.checks || {}),
                [todayKey]: newCount
            }
        };
        delete updatedGoal.id;

        try {
            await updateToFirebaseByIdAndSubId(DB.WELLBEING_GOALS, currentUser.uid, goal.id, updatedGoal);
            showSuccess(newCount > 0 ? t('today_marked_success') : t('today_cleared_success'));
        } catch (ex) {
            showFailure(tCommon('save_exception'));
            console.warn(ex);
        }
    };

    const getFrequencyLabel = (frequencyValue) => {
        if (frequencyValue === FREQUENCY.WEEKLY) {
            return t('frequency_weekly');
        }

        if (frequencyValue === FREQUENCY.MONTHLY) {
            return t('frequency_monthly');
        }

        if (frequencyValue === FREQUENCY.TWICE_DAILY) {
            return t('frequency_twice_daily');
        }

        if (frequencyValue === FREQUENCY.EVERY_OTHER_DAY) {
            return t('frequency_every_other_day');
        }

        return t('frequency_daily');
    };

    const formatDayLabel = (date) => {
        try {
            return new Intl.DateTimeFormat(i18n.language, {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit'
            }).format(date);
        } catch {
            return getDateKey(date);
        }
    };

    const formatMonthLabel = (date) => {
        try {
            return new Intl.DateTimeFormat(i18n.language, {
                month: 'long',
                year: 'numeric'
            }).format(date);
        } catch {
            return `${date.getMonth() + 1}.${date.getFullYear()}`;
        }
    };

    const goToPreviousMonth = () => {
        setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setMonthCursor((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    };

    const goToCurrentMonth = () => {
        const now = new Date();
        setMonthCursor(new Date(now.getFullYear(), now.getMonth(), 1));
    };

    return (
        <PageContentWrapper>
            <PageTitle title={t('title')} iconName={ICONS.CHECK_SQUARE} />

            <Row>
                <ButtonGroup>
                    <GoBackButton />
                </ButtonGroup>
            </Row>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />

            <Form onSubmit={onSaveGoal} className='mb-3 wellbeing-goals-form'>
                <Row>
                    <Col md={5} className='mb-2'>
                        <Form.Group controlId='wellbeing-goal-name'>
                            <Form.Label className='mb-1'>{t('goal_name')}</Form.Label>
                            <Form.Control
                                className='wellbeing-goals-field'
                                type='text'
                                autoComplete='off'
                                placeholder={t('goal_name_placeholder')}
                                value={goalName}
                                onChange={(e) => setGoalName(e.target.value)}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={4} className='mb-2'>
                        <Form.Group controlId='wellbeing-goal-frequency'>
                            <Form.Label className='d-flex align-items-center gap-2 mb-1'>
                                {t('frequency')}
                                <OverlayTrigger
                                    placement='right'
                                    overlay={
                                        <Tooltip id='wellbeing-goal-frequency-help'>
                                            <div className='text-start'>
                                                <strong>{t('frequency_help_title')}</strong>
                                                <div>{t('frequency_help_weekly')}</div>
                                                <div>{t('frequency_help_monthly')}</div>
                                            </div>
                                        </Tooltip>
                                    }
                                >
                                    <span
                                        className='badge rounded-pill bg-info text-dark'
                                        role='button'
                                        aria-label={t('frequency_help_title')}
                                        title={t('frequency_help_title')}
                                        style={{ cursor: 'help' }}
                                    >
                                        i
                                    </span>
                                </OverlayTrigger>
                            </Form.Label>
                            <Form.Select className='wellbeing-goals-field' value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                                <option value={FREQUENCY.DAILY}>{t('frequency_daily')}</option>
                                <option value={FREQUENCY.TWICE_DAILY}>{t('frequency_twice_daily')}</option>
                                <option value={FREQUENCY.EVERY_OTHER_DAY}>{t('frequency_every_other_day')}</option>
                                <option value={FREQUENCY.WEEKLY}>{t('frequency_weekly')}</option>
                                <option value={FREQUENCY.MONTHLY}>{t('frequency_monthly')}</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3} className='mb-2 d-flex align-items-end'>
                        <Button
                            type='submit'
                            className='btn btn-block saveBtn w-100'
                            text={t('add_goal')}
                            color={COLORS.ADDBUTTON_CLOSED}
                        />
                    </Col>
                </Row>
            </Form>

            <Row className='mb-3'>
                <Col className='d-flex gap-2 flex-wrap align-items-center'>
                    <Button
                        className={`btn btn-sm ${viewMode === VIEW_MODE.WEEK ? 'btn-primary' : 'btn-outline-primary'}`}
                        text={t('view_week')}
                        onClick={() => setViewMode(VIEW_MODE.WEEK)}
                        disableStyle={true}
                    />
                    <Button
                        className={`btn btn-sm ${viewMode === VIEW_MODE.MONTH ? 'btn-primary' : 'btn-outline-primary'}`}
                        text={t('view_month')}
                        onClick={() => setViewMode(VIEW_MODE.MONTH)}
                        disableStyle={true}
                    />

                    {viewMode === VIEW_MODE.MONTH ? (
                        <>
                            <Button
                                className='btn btn-sm btn-outline-secondary'
                                iconName={ICONS.ARROW_LEFT}
                                title={t('previous_month')}
                                onClick={goToPreviousMonth}
                                disableStyle={true}
                            />
                            <strong>{formatMonthLabel(monthCursor)}</strong>
                            <Button
                                className='btn btn-sm btn-outline-secondary'
                                iconName={ICONS.ARROW_RIGHT}
                                title={t('next_month')}
                                onClick={goToNextMonth}
                                disableStyle={true}
                            />
                            <Button
                                className='btn btn-sm btn-outline-secondary'
                                text={t('current_month')}
                                title={t('current_month')}
                                onClick={goToCurrentMonth}
                                disableStyle={true}
                            />
                        </>
                    ) : null}
                </Col>
            </Row>

            <Row className='mb-3'>
                <Col>
                    <div className='d-flex flex-column gap-1'>
                        <small className='text-muted'>
                            <strong>{t('successrate_legend_title')}</strong> {successWindowDays === 7 ? t('success_rate_7d') : t('success_rate_30d')}
                        </small>
                        <div className='d-flex gap-2 flex-wrap align-items-center'>
                            <span className='badge bg-danger'>{t('status_low')}</span>
                            <small>{t('successrate_legend_low')}</small>
                            <span className='badge bg-warning text-dark'>{t('status_ok')}</span>
                            <small>{t('successrate_legend_ok')}</small>
                            <span className='badge bg-success'>{t('status_good')}</span>
                            <small>{t('successrate_legend_good')}</small>
                        </div>
                    </div>
                </Col>
            </Row>

            {loading ? (
                <h3>{tCommon('loading')}</h3>
            ) : goals.length === 0 ? (
                <h5>{t('no_goals')}</h5>
            ) : (
                <div className='table-responsive'>
                    <Table striped bordered hover size='sm'>
                        <thead>
                            <tr>
                                <th>{t('goal')}</th>
                                <th>{t('frequency')}</th>
                                <th>{t('stats')}</th>
                                {days.map((day) => (
                                    <th key={getDateKey(day)}>{formatDayLabel(day)}</th>
                                ))}
                                <th>{tCommon('table.actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedGoals.map((goal, goalIndex) => (
                                <tr key={goal.id}>
                                    <td>
                                        {editingGoalId === goal.id ? (
                                            <div className='d-flex gap-2 align-items-center'>
                                                <Form.Control
                                                    type='text'
                                                    size='sm'
                                                    value={editingGoalName}
                                                    onChange={(e) => setEditingGoalName(e.target.value)}
                                                    placeholder={t('goal_name_placeholder')}
                                                />
                                                <Button
                                                    className='btn btn-success btn-sm'
                                                    text={tCommon('buttons.button_save')}
                                                    onClick={() => saveEditedGoalName(goal)}
                                                    disableStyle={true}
                                                />
                                                <Button
                                                    className='btn btn-outline-secondary btn-sm'
                                                    text={tCommon('buttons.button_close')}
                                                    onClick={cancelEditingGoalName}
                                                    disableStyle={true}
                                                />
                                            </div>
                                        ) : (
                                            <div className='d-flex gap-2 align-items-center'>
                                                <span>{goal.name}</span>
                                                <Button
                                                    className='btn btn-outline-primary btn-sm'
                                                    iconName={ICONS.EDIT}
                                                    title={tCommon('buttons.button_edit')}
                                                    onClick={() => startEditingGoalName(goal)}
                                                    disableStyle={true}
                                                />
                                            </div>
                                        )}
                                    </td>
                                    <td>{getFrequencyLabel(goal.frequency)}</td>
                                    <td>
                                        {(() => {
                                            const stats = getGoalStats(goal, successWindowDays);
                                            const successLabel = successWindowDays === 7
                                                ? t('success_rate_7d')
                                                : t('success_rate_30d');

                                            return (
                                                <div className='d-flex flex-column gap-1'>
                                                    <small><strong>{t('streak')}:</strong> {stats.streak}</small>
                                                    <small><strong>{successLabel}:</strong> {stats.successRate}%</small>
                                                    <span className={`badge ${stats.statusClass}`}>{t(stats.statusKey)}</span>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    {days.map((day) => {
                                        const dateKey = getDateKey(day);
                                        const isDue = isGoalDueOnDate(goal, day);

                                        if (!isDue) {
                                            return <td key={`${goal.id}-${dateKey}`}>-</td>;
                                        }

                                        const requiredChecks = getRequiredChecksForFrequency(goal.frequency);
                                        const currentCount = Number(goal?.checks?.[dateKey] || 0);

                                        return (
                                            <td key={`${goal.id}-${dateKey}`}>
                                                <div className='d-flex gap-2 justify-content-center'>
                                                    {Array.from({ length: requiredChecks }, (_, index) => (
                                                        <Form.Check
                                                            key={`${goal.id}-${dateKey}-${index}`}
                                                            type='checkbox'
                                                            checked={currentCount > index}
                                                            onChange={() => onToggleCheck(goal, dateKey, index)}
                                                        />
                                                    ))}
                                                </div>
                                            </td>
                                        );
                                    })}
                                    <td>
                                        <div className='d-flex gap-1 flex-wrap'>
                                            <Button
                                                className={`btn btn-sm ${Number(goal?.checks?.[getDateKey(new Date())] || 0) >= getRequiredChecksForFrequency(goal.frequency)
                                                    ? 'btn-success'
                                                    : 'btn-outline-success'}`}
                                                iconName={ICONS.CHECK_SQUARE}
                                                text={t('quick_today')}
                                                title={t('quick_today')}
                                                onClick={() => onQuickToggleToday(goal)}
                                                disableStyle={true}
                                                disabled={!isGoalDueOnDate(goal, new Date())}
                                            />
                                            <Button
                                                className='btn btn-outline-secondary btn-sm'
                                                iconName={ICONS.ARROW_UP}
                                                title={t('move_up')}
                                                onClick={() => moveGoal(goal.id, 'up')}
                                                disableStyle={true}
                                                disabled={goalIndex === 0}
                                            />
                                            <Button
                                                className='btn btn-outline-secondary btn-sm'
                                                iconName={ICONS.ARROW_DOWN}
                                                title={t('move_down')}
                                                onClick={() => moveGoal(goal.id, 'down')}
                                                disableStyle={true}
                                                disabled={goalIndex === orderedGoals.length - 1}
                                            />
                                            <Button
                                                className='btn btn-danger btn-sm'
                                                iconName={ICONS.DELETE}
                                                title={tCommon('buttons.button_delete')}
                                                onClick={() => {
                                                    if (window.confirm(tCommon('confirm.areyousure'))) {
                                                        onDeleteGoal(goal.id);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            )}
        </PageContentWrapper>
    );
}
