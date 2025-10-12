import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { DB, TRANSLATION } from '../../utils/Constants';
import { getFromFirebaseByIdAndSubId } from '../../datatier/datatier';
import PropTypes from 'prop-types';

export default function AddTask({ taskID, taskListID, onSave, onClose, showLabels }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [text, setText] = useState('');
    const [day, setDay] = useState('');
    const [reminder, setReminder] = useState(false);
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    useEffect(() => {
        if (taskID != null) {
            const getTask = async () => {
                await fetchTaskFromFirebase(taskID, taskListID);
            }
            getTask();
        }
    }, [taskID, taskListID]);

    const fetchTaskFromFirebase = async (taskID, taskListID) => {
        getFromFirebaseByIdAndSubId(DB.TASKS, taskListID, taskID).then((val) => {
            setText(val["text"]);
            setDay(val["day"]);
            setReminder(val["reminder"]);
            setCreated(val["created"]);
            setCreatedBy(val["createdBy"]);
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if (!text) {
            alert(t('please_add_task'));
            return;
        }

        onSave(taskListID, { created, createdBy, text, day, reminder });

        if (taskID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setText('');
        setDay('');
        setReminder(false);
    }

    const getTaskName = () => {
        //TODO: Different text if listtype = tasklist or other
        return t('task_name');
    }

    const getTaskText = () => {
        //TODO: Different text if listtype = tasklist or other
        return t('task_text');
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                {showLabels && <Form.Label>{getTaskName()}</Form.Label>}
                <Form.Control
                    autoComplete="off"
                    type='text'
                    placeholder={getTaskName()}
                    value={text}
                    onChange={(e) => setText(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTaskFormDayAndTime">
                {showLabels && <Form.Label>{getTaskText()}</Form.Label>}
                <Form.Control
                    autoComplete="off"
                    type='text'
                    placeholder={getTaskText()}
                    value={day}
                    onChange={(e) => setDay(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTaskFormReminder">
                <Form.Check
                    type='checkbox'
                    controlId="formBasicCheckbox"
                    label={t('set_reminder')}
                    checked={reminder}
                    value={reminder}
                    onChange={(e) => setReminder(e.currentTarget.checked)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                        onClick={() => onClose()}
                    />
                    <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}

AddTask.defaultProps = {
    showLabels: true
}

AddTask.propTypes = {
    showLabels: PropTypes.bool
}