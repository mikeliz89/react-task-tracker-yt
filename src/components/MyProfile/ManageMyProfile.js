import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import { useTranslation } from 'react-i18next';
import { Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db, uploadProfilePic } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import PageTitle from '../Site/PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import { updateToFirebaseById } from '../../datatier/datatier';
import Modal from '../ImageUpload/Modal';
import Logout from '../Auth/Logout';
import RightWrapper from '../Site/RightWrapper';
import Language from '../Language/Language';
import ThemeToggler from '../Site/ThemeToggler';

export default function ManageMyProfile() {

    //avatar
    const imageName = 'defaultavatar.png';
    const defaultPhotoUrl = `/images/${imageName}`;

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.MYPROFILE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //user
    const { currentUser } = useAuth();

    //states
    const [name, setName] = useState('');
    const [height, setHeight] = useState(0);
    const [photoUrl, setPhotoUrl] = useState(defaultPhotoUrl);
    const [photo, setPhoto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
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
        const dbref = ref(db, `${DB.PROFILES}/${currentUser.uid}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setName(data["name"]);
                setHeight(data["height"]);
            }
        })
    }

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
        data["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.PROFILES, currentUser.uid, data);
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

            <RightWrapper>
                <Language />
                <ThemeToggler />
                <Logout />
            </RightWrapper>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            {/* <p>PhotoUrl: {photoUrl}</p> */}
            <img src={photoUrl} alt='avatar' className='avatar' onClick={() => setSelectedImage(photoUrl)} />

            {selectedImage && <Modal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}

            <Form onSubmit={onSubmit}>
                <Form.Group>
                    <Form.Label>{t('profilepic')}</Form.Label>
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
                <Button type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
            </Form>
        </PageContentWrapper>
    )
}
