import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { DB, ICONS, TRANSLATION } from '../../utils/Constants';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import Alert from '../Alert';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
import AddReminder from './AddReminder';
import Reminder from './Reminder';

export default function ManageReminders() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.REMINDERS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { currentUser } = useAuth();
    const { data, loading } = useFetch(DB.REMINDERS);
    const { status: showAdd, toggleStatus: toggleAdd } = useToggle();
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure,
    } = useAlert();

    const userEmail = currentUser?.email;
    const userId = currentUser?.uid;

    const visibleItems = useMemo(() => {
        const list = Array.isArray(data) ? data : [];
        return list.filter((item) => {
            if (!item || typeof item !== 'object') {
                return false;
            }

            if (item.userId) {
                return item.userId === userId;
            }

            if (item.createdBy && userEmail) {
                return item.createdBy === userEmail;
            }

            return false;
        });
    }, [data, userEmail, userId]);

    const addReminder = async (_, payload) => {
        try {
            clearMessages();
            const reminder = {
                ...payload,
                created: getCurrentDateAsJson(),
                createdBy: currentUser?.email || '',
                userId: currentUser?.uid || '',
            };

            await pushToFirebase(DB.REMINDERS, reminder);
            showSuccess(tCommon('save_success'));
            toggleAdd();
        } catch {
            showFailure(tCommon('save_exception'));
        }
    };

    const deleteReminder = async (id) => {
        await removeFromFirebaseById(DB.REMINDERS, id);
    };

    if (loading) {
        return <h3>{tCommon('loading')}</h3>;
    }

    return (
        <PageContentWrapper>
            <PageTitle title={t('title')} iconName={ICONS.BELL} />

            <div className='d-flex gap-2 mb-3'>
                <GoBackButton />
                <Button
                    iconName={ICONS.PLUS}
                    text={showAdd ? tCommon('buttons.button_close') : t('add')}
                    onClick={toggleAdd}
                    color={showAdd ? 'red' : 'green'}
                />
            </div>

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />

            {showAdd && (
                <div className='content-card mb-3'>
                    <AddReminder onSave={addReminder} onClose={toggleAdd} />
                </div>
            )}

            {visibleItems.length > 0 ? (
                visibleItems.map((item) => (
                    <Reminder key={item.id} item={item} onDelete={deleteReminder} />
                ))
            ) : (
                <div className='content-card'>
                    <p className='mb-0'>{tCommon('nothing_to_show')}</p>
                </div>
            )}
        </PageContentWrapper>
    );
}
