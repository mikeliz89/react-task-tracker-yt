//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../../components/Button';

const AddTaskList = ({ taskListID, onSave, onClose }) => {

    const DB_TASKLISTS = '/tasklists';

    //translation
    const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

    //states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [listType, setListType] = useState();

    useEffect(() => {
        if (taskListID != null) {
            const getTaskList = async () => {
                await fetchTaskListFromFirebase(taskListID);
            }
            getTaskList();
        }
    }, [taskListID]);

    const fetchTaskListFromFirebase = async (taskListID) => {

        const dbref = ref(db, `${DB_TASKLISTS}/${taskListID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setDescription(val["description"]);
                setListType(val["listType"]);
                setTitle(val["title"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if (!title) {
            alert(t('please_add_tasklist'));
            return;
        }

        onSave({ created, createdBy, title, description, listType });

        if (taskListID == null) {
            clearForm();
        }
    }

    const clearForm = () => {
        setTitle('');
        setDescription('');
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="formBasicTaskListName">
                <Form.Label>{t('task_list')}</Form.Label>
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={taskListID == null ? t('task_list') : t('edit_task_list')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTaskListDescription">
                <Form.Label>{t('description')}</Form.Label>
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={taskListID == null ? t('add_description') : t('edit_description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={t('button_close')} className='btn btn-block'
                        onClick={() => onClose()} />
                    <Button type='submit' text={t('button_save_list')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}

export default AddTaskList
