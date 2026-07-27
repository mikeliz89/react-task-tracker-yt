import { useEffect, useState } from 'react';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, DB } from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../Buttons/Button';
import useFetchById from '../Hooks/useFetchById';

export default function AddReminder({ reminderID, onSave, onClose, showLabels = true }) {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.REMINDERS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
    const { currentUser } = useAuth();

    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [userId, setUserId] = useState('');

    const reminderData = useFetchById(DB.REMINDERS, reminderID);

    useEffect(() => {
        if (!reminderData) {
            return;
        }

        setName(reminderData.name || '');
        setDate(reminderData.date || '');
        setCreated(reminderData.created || '');
        setCreatedBy(reminderData.createdBy || '');
        setUserId(reminderData.userId || '');
    }, [reminderData]);

    const onSubmit = (e) => {
        e.preventDefault();

        if (!name.trim() || !date) {
            alert(t('please_fill_required_fields'));
            return;
        }

        onSave(reminderID, {
            name: name.trim(),
            date,
            created,
            createdBy,
            userId: userId || currentUser?.uid || '',
        });

        if (reminderID == null) {
            setName('');
            setDate('');
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className='mb-3' controlId='addReminderForm-Name'>
                {showLabels && <Form.Label>{t('name')}</Form.Label>}
                <Form.Control
                    type='text'
                    autoComplete='off'
                    placeholder={t('name')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </Form.Group>

            <Form.Group className='mb-3' controlId='addReminderForm-Date'>
                {showLabels && <Form.Label>{t('date')}</Form.Label>}
                <Form.Control
                    type='date'
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </Form.Group>

            <Row>
                <ButtonGroup>
                    <Button
                        type='button'
                        text={tCommon('buttons.button_close')}
                        className='btn btn-block'
                        onClick={() => onClose()}
                    />
                    <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    );
}
