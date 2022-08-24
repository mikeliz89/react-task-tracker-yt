//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../../components/Button';

const AddTask = ({ taskID, taskListID, onAddTask, onClose }) => {

    //translation
    const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

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
        const dbref = ref(db, `/tasks/${taskListID}/${taskID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setText(val["text"]);
                setDay(val["day"]);
                setReminder(val["reminder"]);
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if (!text) {
            alert(t('please_add_task'))
            return
        }

        onAddTask(taskListID, { created, createdBy, text, day, reminder })

        if (taskID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setText('');
        setDay('');
        setReminder(false);
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                <Form.Label>{t('task_name')}</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type='text'
                    placeholder={t('task_name')}
                    value={text}
                    onChange={(e) => setText(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="addTaskFormDayAndTime">
                <Form.Label>{t('day_and_time')}</Form.Label>
                <Form.Control
                    autoComplete="off"
                    type='text'
                    placeholder={t('day_and_time')}
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
                    <Button type='button' text={t('button_close')} className='btn btn-block'
                        onClick={() => onClose()}
                    />
                    <Button type='submit' text={t('button_save_task')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}

export default AddTask
