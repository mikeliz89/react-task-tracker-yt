import GoBackButton from '../GoBackButton';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import Button from '../Button';
import { db } from '../../firebase-config';
import { ref, onValue, update } from "firebase/database";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

export default function ManageMyProfile() {

    const { t } = useTranslation('myprofile', {keyPrefix: 'myprofile'});
    const { currentUser } = useAuth();

    //states
    const [name, setName] = useState('')
    const [height, setHeight] = useState(0)

    //load data
    useEffect(() => {
        let isMounted = true;
        const getProfile = async () => {
            if (isMounted)
                await fetchProfileFromFirebase();
        }
        getProfile()
        return () => { isMounted = false };
    }, [])

    /** Fetch Profile From Firebase */
    const fetchProfileFromFirebase = async () => {
        const dbref = ref(db, '/profiles/' + currentUser.uid);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setName(data["name"]);
                setHeight(data["height"]);
            }
        })
    }

    /** Recipe Form Submit */
    const onSubmit = (e) => {
        e.preventDefault()
        saveProfileToFirebase()
    }

    const saveProfileToFirebase = async () => {
        let data = { name, height };
        //save edited profile to firebase
        const updates = {};
        data["modified"] = getCurrentDateAsJson()
        updates[`/profiles/${currentUser.uid}`] = data;
        update(ref(db), updates);
    }

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('title')}</h3>
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="myProfileFormName">
                    <Form.Label>{t('name')}</Form.Label>
                    <Form.Control type='text'
                        placeholder={t('name')}
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addIncredientFormAmount">
                    <Form.Label>{t('height')}</Form.Label>
                    <Form.Control
                        type='number'
                        placeholder={t('height')}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)} />
                </Form.Group>
                <Button type='submit' text={t('savebutton')} className='btn btn-block saveBtn' />
            </Form>
        </div>
    )
}
