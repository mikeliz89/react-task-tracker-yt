//react
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../../components/Button'
//utils
import * as Constants from '../../utils/Constants';

const EditLink = ({ linkID, objID, linkUrl, onEditLink, onCloseEditLink }) => {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_LINKS, { keyPrefix: Constants.TRANSLATION_LINKS });

    //states
    const [url, setUrl] = useState('');
    const [urlText, setUrlText] = useState('');

    useEffect(() => {

        if (linkID != null) {
            const getLink = async () => {
                if (objID != null) {
                    await fetchLinkFromFirebase(linkID, objID);
                } else {
                    await fetchLinkFromFirebaseWithoutObjID(linkID);
                }
            }
            getLink()
        }
    }, [linkID]);

    const fetchLinkFromFirebaseWithoutObjID = async (linkID) => {
        const dbref = ref(db, `${linkUrl}/${linkID}`);
        fetch(dbref);
    }

    const fetchLinkFromFirebase = async (linkID, objID) => {
        const dbref = ref(db, `${linkUrl}/${objID}/${linkID}`);
        fetch(dbref);
    }

    const fetch = async (dbref) => {
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setUrl(val["url"]);
                setUrlText(val["urlText"]);
            }
        });
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
                    <Button type='button' text={t('button_close')} className='btn btn-block' onClick={() => close()} />
                    <Button type='submit' text={t('save_link')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}

export default EditLink