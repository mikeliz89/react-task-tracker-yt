//react
import { Form } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button';
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

function AddComment({ onSave }) {

    //states
    const [text, setText] = useState();

    const [showAddComment, setShowAddComment] = useState(false);

    //translation
    const { t } = useTranslation('comments', { keyPrefix: 'comments' });

    /** Add Task Form Submit */
    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!text) {
            return;
        }

        const created = getCurrentDateAsJson;
        //call the TaskListDetails.js
        onSave({ created, text });

        //clear the form
        setText('');
    }

    return (
        <>
            <Button type="button"
                color={showAddComment ? 'red' : '#0d6efd'}
                text={
                    showAddComment ? t('button_close') : t('add_comment')
                }
                onClick={() => setShowAddComment(!showAddComment)} />
            {
                showAddComment &&
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="addTaskFormTaskName">
                        <Form.Label>{t('text')}</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder={t('text')}
                            value={text}
                            onChange={(e) => setText(e.target.value)} />
                        <Button type="submit" text="Tallenna" className="btn btn-block saveBtn" />
                    </Form.Group>
                </Form>
            }
        </>
    )
}

export default AddComment
