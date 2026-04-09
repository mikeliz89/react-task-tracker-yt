import { useEffect, useState } from 'react';
import { ButtonGroup, Col, Form, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { TRANSLATION, ICONS } from '../../utils/Constants';
import Button from '../Buttons/Button';

export default function AddLink({
    onSaveLink,
    linkID,
    initialUrl,
    initialUrlText,
    onClose,
    showToggleButton
}) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });

const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [url, setUrl] = useState(initialUrl || '');
    const [urlText, setUrlText] = useState(initialUrlText || '');
    const [showForm, setShowForm] = useState(showToggleButton ? false : true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUrl(initialUrl || '');
        setUrlText(initialUrlText || '');
    }, [initialUrl, initialUrlText, linkID]);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!url || !urlText) {
            return;
        }

        setLoading(true);

        const payload = linkID != null
            ? { id: linkID, url, urlText }
            : { url, urlText };

        onSaveLink(payload);

        if (linkID != null) {
            setLoading(false);
            onClose();
            return;
        }

        clearForm();
    }

    const clearForm = () => {
        setUrl('');
        setUrlText('');
        setLoading(false);
    }

    return (
        <>
            {showToggleButton &&
                <Button
                    iconName={ICONS.PLUS}
                    type='button'
                    disableStyle={true}
                    className={showForm ? 'btn btn-danger' : 'btn btn-primary'}
                    text={showForm ? tCommon('buttons.button_close') : t('add_link')}
                    onClick={() => setShowForm(!showForm)} />
            }
            {
                showForm ? (
                    <>
                        <Row>
                            <Col>
                                <Form onSubmit={onSubmit}>
                                    <Form.Group className="mb-3" controlId="addLinkForm-UrlText">
                                        <Form.Label>{t('urlText')}</Form.Label>
                                        <Form.Control type='text'
                                            autoComplete="off"
                                            placeholder={t('urlText')}
                                            value={urlText}
                                            onChange={(e) => setUrlText(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="addLinkForm-Url">
                                        <Form.Label>{t('url')}</Form.Label>
                                        <Form.Control type='text'
                                            autoComplete="off"
                                            placeholder={t('url')}
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)} />
                                    </Form.Group>
                                    <Row>
                                        <ButtonGroup>
                                            <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block'
                                                onClick={() => {
                                                    if (showToggleButton) {
                                                        setShowForm(false);
                                                    } else {
                                                        onClose();
                                                    }
                                                }} />
                                            <Button disabled={loading} type='submit' text={t('save_link')} className='btn btn-block saveBtn' />
                                        </ButtonGroup>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </>) : ''
            }
        </>
    )
}

AddLink.defaultProps = {
    linkID: null,
    initialUrl: '',
    initialUrlText: '',
    onClose: () => { },
    showToggleButton: true
}


