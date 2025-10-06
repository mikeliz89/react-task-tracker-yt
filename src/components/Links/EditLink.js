import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../Buttons/Button'
import * as Constants from '../../utils/Constants';
import { getFromFirebaseById, getFromFirebaseByIdAndSubId } from '../../datatier/datatier';

export default function EditLink({ linkID, objID, linkUrl, onEditLink, onCloseEditLink }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_LINKS });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    //states
    const [url, setUrl] = useState('');
    const [urlText, setUrlText] = useState('');

    useEffect(() => {
        if (linkID != null) {
            const getLink = async () => {
                if (objID != null) {
                    const val = await getFromFirebaseByIdAndSubId(linkUrl, objID, linkID);
                    setValues(val);
                } else {
                    const val = await getFromFirebaseById(linkUrl, linkID);
                    setValues(val);
                }
            }
            getLink();
        }
    }, [linkID]);

    const setValues = (val) => {
        if (val === null) {
            return;
        }
        setUrl(val["url"]);
        setUrlText(val["urlText"]);
    }

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
