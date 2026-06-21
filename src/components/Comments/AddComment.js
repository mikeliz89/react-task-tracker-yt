import { useEffect, useState } from 'react';
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Button from '../Buttons/Button';

export default function AddComment({ onSave, commentID, initialText, onClose, showToggleButton }) {

    //states
    const [text, setText] = useState(initialText);
    const [showAddComment, setShowAddComment] = useState(!showToggleButton);
    const [loading, setLoading] = useState(false);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.COMMENTS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    useEffect(() => {
        setText(initialText);
    }, [initialText, commentID]);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!text) {
            return;
        }

        setLoading(true);

        const payload = commentID != null
            ? { id: commentID, text }
            : { created: getCurrentDateAsJson(), text };
        onSave(payload);

        clearForm();
        if (showToggleButton) {
            setShowAddComment(false);
        }
        if (typeof onClose === 'function') {
            onClose();
        }
        setLoading(false);
    }

    const clearForm = () => {
        setText('');
    }

    return (
        <div className="add-comment-wrapper">
            {showToggleButton && (
                <Button type="button"
                    iconName={ICONS.PLUS}
                    disabled={loading}
                    disableStyle={true}
                    className={showAddComment ? 'btn btn-primary comments-add-button comments-add-button-open' : 'btn btn-primary comments-add-button'}
                    text={
                        showAddComment ? tCommon('buttons.button_close') : t('add_comment')
                    }
                    onClick={() => setShowAddComment(!showAddComment)} />
            )}
            {
                showAddComment &&
                <div className="add-comment-form-row">
                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3 comments-form-group" controlId="addCommentForm-Text">
                            <Form.Label>{t('text')}</Form.Label>
                            <Form.Control
                                autoComplete="off"
                                as='textarea'
                                rows={4}
                                placeholder={t('text')}
                                value={text}
                                onChange={(e) => setText(e.target.value)} />
                            <Row className="comments-form-actions">
                                <ButtonGroup>
                                    <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block comments-secondary-button'
                                        onClick={() => {
                                            if (showToggleButton) {
                                                setShowAddComment(false);
                                            }
                                            if (typeof onClose === 'function') {
                                                onClose();
                                            }
                                        }} />
                                    <Button type="submit" text={tCommon('buttons.button_save')} className="btn btn-block saveBtn comments-save-button" />
                                </ButtonGroup>
                            </Row>
                        </Form.Group>
                    </Form>
                </div>
            }
        </div>
    )
}

AddComment.defaultProps = {
    commentID: null,
    initialText: '',
    onClose: null,
    showToggleButton: true,
}



