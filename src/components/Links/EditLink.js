import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button'
import { TRANSLATION } from '../../utils/Constants';
import useFetchByIdAndSubId from '../Hooks/useFetchByIdAndSubId';
import useFetchById from '../Hooks/useFetchById';

export default function EditLink({ linkID, objID, linkUrl, onEditLink, onCloseEditLink }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.LINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //states
    const [url, setUrl] = useState('');
    const [urlText, setUrlText] = useState('');

    //load data
    const linkDataBySubId = useFetchByIdAndSubId(linkUrl, objID, linkID);
    const linkDataById = useFetchById(linkUrl, linkID);

    const linkData = objID != null ? linkDataBySubId : linkDataById;

    useEffect(() => {
        if (linkData) {
            setUrl(linkData.url || '');
            setUrlText(linkData.urlText || '');
        }
    }, [linkData]);

    const onSubmit = (e) => {
        e.preventDefault();
        let link = { id: linkID, url, urlText };
        onEditLink(link);
    }

    const close = (e) => {
        onCloseEditLink();
    }

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3" controlId="editLinkForm-UrlText">
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={t('urlText')}
                    value={urlText}
                    onChange={(e) => setUrlText(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="editLinkForm-Url">
                <Form.Control type='text'
                    autoComplete="off"
                    placeholder={t('url')}
                    value={url}
                    onChange={(e) => setUrl(e.target.value)} />
            </Form.Group>
            <Row>
                <ButtonGroup>
                    <Button type='button' text={tCommon('buttons.button_close')} className='btn btn-block' onClick={() => close()} />
                    <Button type='submit' text={t('save_link')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}
