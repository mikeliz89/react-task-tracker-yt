import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { updateToFirebaseById } from '../../datatier/datatier';
import i18n from 'i18next';
import { DB, ICONS, NAVIGATION, TRANSLATION } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateString } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import AddReminder from './AddReminder';

function getDaysUntil(dateValue, now = new Date()) {
    if (!dateValue) {
        return null;
    }

    const targetDate = new Date(dateValue);
    if (Number.isNaN(targetDate.getTime())) {
        return null;
    }

    const currentDate = new Date(now);
    currentDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    return Math.round((targetDate - currentDate) / millisecondsPerDay);
}

export default function Reminder({ item, onDelete }) {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.REMINDERS });
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
    } = useAlert();

    const [editable, setEditable] = useState(false);

    const updateReminder = (updateReminderID, object) => {
        const payload = {
            ...object,
            modified: getCurrentDateAsJson(),
        };

        updateToFirebaseById(DB.REMINDERS, updateReminderID, payload);
        setEditable(false);
    };

    const daysUntil = getDaysUntil(item.date);
    const dueText = daysUntil == null
        ? '-'
        : daysUntil === 0
            ? t('due_today')
            : daysUntil > 0
                ? t('due_in_days', { days: daysUntil })
                : t('overdue_by_days', { days: Math.abs(daysUntil) });

    return (
        <ListRow
            item={item}
            dbKey={DB.REMINDERS}
            headerProps={{
                title: item.name,
                titleTo: NAVIGATION.MANAGE_REMINDERS,
                titleIcon: ICONS.BELL,
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            alert={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
            }}
            section={(
                <>
                    <p>{t('date')}: {getJsonAsDateString(item.date, i18n.language)}</p>
                    <p>{t('status')}: {dueText}</p>
                </>
            )}
            modalProps={{
                modalTitle: t('edit_reminder'),
                modalBody: (
                    <AddReminder
                        reminderID={item.id}
                        onSave={updateReminder}
                        onClose={() => setEditable(false)}
                    />
                )
            }}
            showSetStarRating={false}
            showStarRating={false}
        />
    );
}
