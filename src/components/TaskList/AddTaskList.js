import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Row, ButtonGroup, Form } from 'react-bootstrap';
import Button from '../Buttons/Button';
import { TRANSLATION, DB } from '../../utils/Constants';
import useFetchById from '../Hooks/useFetchById';
import PropTypes from 'prop-types';

export default function AddTaskList({ taskListID, onSave, onClose, showLabels, defaultTitle }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TASKLIST, { keyPrefix: TRANSLATION.TASKLIST });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [listType, setListType] = useState();

    //load data
    const taskListData = useFetchById(DB.TASKLISTS, taskListID);

    useEffect(() => {
        if (taskListID == null) {
            setTitle(defaultTitle);
        } else if (taskListData) {
            setCreated(taskListData.created || '');
            setCreatedBy(taskListData.createdBy || '');
            setDescription(taskListData.description || '');
            setListType(taskListData.listType);
            setTitle(taskListData.title || '');
        }
    }, [taskListID, defaultTitle, taskListData]);

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
                {showLabels && <Form.Label>{t('task_list')}</Form.Label>}
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={taskListID == null ? t('task_list') : t('edit_task_list')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicTaskListDescription">
                {showLabels && <Form.Label>{t('description')}</Form.Label>}
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={taskListID == null ? t('add_description') : t('edit_description')}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                        onClick={() => onClose()} />
                    <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}

AddTaskList.defaultProps = {
    showLabels: true
}

AddTaskList.propTypes = {
    showLabels: PropTypes.bool,
    defaultTitle: PropTypes.string
}