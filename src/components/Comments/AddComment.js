import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Button';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';

function AddComment({ onSave }) {

    //states
    const [text, setText] = useState();
    const [showAddComment, setShowAddComment] = useState(false);
    const [loading, setLoading] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_COMMENTS, { keyPrefix: Constants.TRANSLATION_COMMENTS });

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!text) {
            return;
        }

        setLoading(true);

        const created = getCurrentDateAsJson;
        onSave({ created, text });

        clearForm();

        setLoading(false);
    }

    const clearForm = () => {
        setText('');
    }

    return (
        <>
            <Button type="button"
                iconName='comments'
                disabled={loading}
                disableStyle={true}
                className={showAddComment ? 'btn btn-danger' : 'btn btn-primary'}
                text={
                    showAddComment ? t('button_close') : t('add_comment')
                }
                onClick={() => setShowAddComment(!showAddComment)} />
            {
                showAddComment &&
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="addCommentForm-Text">
                        <Form.Label>{t('text')}</Form.Label>
                        <Form.Control
                            autoComplete="off"
                            type='text'
                            placeholder={t('text')}
                            value={text}
                            onChange={(e) => setText(e.target.value)} />
                        <Row>
                            <ButtonGroup>
                                <Button type='button' text={t('button_close')} className='btn btn-block'
                                    onClick={() => setShowAddComment(false)} />
                                <Button type="submit" text={t('button_save')} className="btn btn-block saveBtn" />
                            </ButtonGroup>
                        </Row>
                    </Form.Group>
                </Form>
            }
        </>
    )
}

export default AddComment
