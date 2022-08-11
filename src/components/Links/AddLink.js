//react
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Col, Form, Row } from 'react-bootstrap';
//buttons
import Button from '../Button';

const AddLink = ({ onSaveLink }) => {

    //translation
    const { t } = useTranslation('links', { keyPrefix: 'links' });

    //states
    const [url, setUrl] = useState('');
    const [urlText, setUrlText] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);

    const onSubmit = (e) => {
        e.preventDefault();

        //validation
        if (!url || !urlText) {
            return;
        }

        setLoading(true);

        //call the RecipeDetails.js
        onSaveLink({ url, urlText });

        //clear the form
        setUrl('');
        setUrlText('');
        setLoading(false);
    }

    return (
        <>
            <Button
                iconName='external-link-alt'
                type='button'
                color={showForm ? 'red' : '#0d6efd'}
                text={showForm ? t('button_close') : t('add_link')}
                onClick={() => setShowForm(!showForm)} />
            {
                showForm ? (
                    <>
                        <Row>
                            <Col>
                                {/* <LinkComponent /> */}
                                <Form onSubmit={onSubmit}>
                                    <Form.Group className="mb-3" controlId="addLinkForm-UrlText">
                                        <Form.Control type='text'
                                            autoComplete="off"
                                            placeholder={t('urlText')}
                                            value={urlText}
                                            onChange={(e) => setUrlText(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="addLinkForm-Url">
                                        <Form.Control type='text'
                                            autoComplete="off"
                                            placeholder={t('url')}
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)} />
                                    </Form.Group>
                                    <Row>
                                        <ButtonGroup>
                                            <Button type='button' text={t('button_close')} className='btn btn-block'
                                                onClick={() => setShowForm(false)} />
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

export default AddLink
