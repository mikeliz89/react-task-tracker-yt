//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//react
import { useTranslation } from 'react-i18next';
import { Form, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
//auth
import { useAuth } from '../../contexts/AuthContext';
//firebase
import { db, uploadProfilePic } from '../../firebase-config';
import { ref, onValue, update } from "firebase/database";
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

export default function ManageMyProfile() {

    const DB_PROFILES = '/profiles';

    //avatar
    const imageName = 'defaultavatar.png';
    const defaultPhotoUrl = `/images/${imageName}`;

    //translation
    const { t } = useTranslation('myprofile', { keyPrefix: 'myprofile' });

    //user
    const { currentUser } = useAuth();

    //states
    const [name, setName] = useState('');
    const [height, setHeight] = useState(0);
    const [photoUrl, setPhotoUrl] = useState(defaultPhotoUrl);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(false);
    //message
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');

    //load data
    useEffect(() => {
        let isMounted = true;
        const getProfile = async () => {
            if (isMounted)
                await fetchProfileFromFirebase();
        }
        getProfile()
        return () => { isMounted = false };
    }, []);

    useEffect(() => {
        if (currentUser && currentUser.photoURL) {
            setPhotoUrl(currentUser.photoURL);
        }
    }, [currentUser]);

    /** Fetch Profile From Firebase */
    const fetchProfileFromFirebase = async () => {
        const dbref = ref(db, `${DB_PROFILES}/${currentUser.uid}`);
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
        saveProfileToFirebase();

        setShowMessage(true);
        setMessage(t("saving_done"));
    }

    const saveProfileToFirebase = async () => {
        let data = { name, height };
        //save edited profile to firebase
        const updates = {};
        data["modified"] = getCurrentDateAsJson()
        updates[`${DB_PROFILES}/${currentUser.uid}`] = data;
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
            setShowMessage(true);
            setMessage(t("saving_done"));

            setPhotoUrl(currentUser.photoURL);
        }
    }

    return (
        <div>
            <GoBackButton />
            <h3 className="page-title">{t('title')}</h3>
            {message &&
                <Alert show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>}
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
        </div>
    )
}
