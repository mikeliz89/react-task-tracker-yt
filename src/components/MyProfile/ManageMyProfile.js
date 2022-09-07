import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, uploadProfilePic } from '../../firebase-config';
import { ref, onValue, update } from "firebase/database";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import PageTitle from '../PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../PageContentWrapper';

export default function ManageMyProfile() {

    //avatar
    const imageName = 'defaultavatar.png';
    const defaultPhotoUrl = `/images/${imageName}`;

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_MYPROFILE, { keyPrefix: Constants.TRANSLATION_MYPROFILE });

    //user
    const { currentUser } = useAuth();

    //states
    const [name, setName] = useState('');
    const [height, setHeight] = useState(0);
    const [photoUrl, setPhotoUrl] = useState(defaultPhotoUrl);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //load data
    useEffect(() => {
        let isMounted = true;
        const getProfile = async () => {
            if (isMounted) {
                await fetchProfileFromFirebase();
            }
        }
        getProfile()
        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.photoURL) {
            setPhotoUrl(currentUser.photoURL);
        }
    }, [currentUser]);

    const fetchProfileFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_PROFILES}/${currentUser.uid}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setName(data["name"]);
                setHeight(data["height"]);
            }
        })
    }

    /** Form Submit */
    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if (height > 220) {
            alert("maksimi pituus on 220 cm!");
            showFailure();
            return;
        }

        saveProfileToFirebase();

        showSuccess();
    }

    const saveProfileToFirebase = async () => {
        let data = { name, height };
        const updates = {};
        data["modified"] = getCurrentDateAsJson()
        updates[`${Constants.DB_PROFILES}/${currentUser.uid}`] = data;
        update(ref(db), updates);
    }

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setPhoto(e.target.files[0]);
        }
    }

    const handleClick = () => {
        const res = uploadProfilePic(photo, currentUser, setLoading);
        if (res) {
            showSuccess();
            setPhotoUrl(currentUser.photoURL);
        }
    }

    function showFailure() {
        setShowError(true);
        setError(t('saving_failed'));
    }

    function showSuccess() {
        setShowMessage(true);
        setMessage(t('saving_done'));
    }

    return (
        <PageContentWrapper>
            <GoBackButton />
            <PageTitle title={t('title')} />

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {/* <p>PhotoUrl: {photoUrl}</p> */}
            <img src={photoUrl} alt='avatar' className='avatar' />
            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Control type="file" onChange={handleChange} />
                    <Button disabled={loading || !photo} type='button' text={t('upload')}
                        className='btn btn-block'
                        onClick={handleClick} />
                </Form.Group>
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
        </PageContentWrapper>
    )
}
