//import RightWrapper from '../Site/RightWrapper';

import { ref, onValue } from 'firebase/database';
import { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../../contexts/AuthContext';
import { updateToFirebaseById } from '../../datatier/datatier';
import { db, uploadProfilePic } from '../../firebase-config';
import { ICONS } from '../../utils/Constants';
import { TRANSLATION, DB } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import Alert from '../Alert';
import Logout from '../Auth/Logout';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import { useAlert } from '../Hooks/useAlert';
import Icon from '../Icon';
import Modal from '../ImageUpload/Modal';
import Language from '../Language/Language';
import PageContentWrapper from '../Site/PageContentWrapper';
import PageTitle from '../Site/PageTitle';
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
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //load data
    useEffect(() => {
        if (!currentUser?.uid) {
            return;
        }

        const dbref = ref(db, `${DB.PROFILES}/${currentUser.uid}`);
        const unsubscribe = onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                setName(data["name"]);
                setHeight(data["height"]);
            }
        });

        return () => {
            unsubscribe();
        };
    }, [currentUser?.uid]);

    useEffect(() => {
        if (currentUser && currentUser.photoURL) {
            setPhotoUrl(currentUser.photoURL);
        }
    }, [currentUser]);

    const onSubmit = (e) => {
        e.preventDefault()

        //validation
        if (Number(height) > 220) {
            showFailure(t('max_height_220_cm'));
            return;
        }

        saveProfileToFirebase();

        showSuccess(t('saving_done'));
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
            showSuccess(t('saving_done'));
            setPhotoUrl(currentUser.photoURL);
        }
    }

    const username = currentUser?.email?.split('@')[0] || '';

    return (
        <PageContentWrapper>
            <GoBackButton />

            <PageTitle title={t('title')} iconName={ICONS.GEAR} />

            {/* <RightWrapper>
                <Language />
                <ThemeToggler />
                <Logout />
            </RightWrapper> */}

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
            />

            <Form onSubmit={onSubmit} className='myprofile-page'>
                <div className='content-card myprofile-main-card'>
                    <h3 className='myprofile-card-title'>
                        <Icon name={ICONS.USER_ALT} />
                        {t('profile_section')}
                    </h3>

                    <div className='row g-4'>
                        <div className='col-12 col-lg-6'>
                            <div className='myprofile-avatar-section'>
                                <div className='myprofile-identity'>
                                    <img
                                        src={photoUrl}
                                        alt='avatar'
                                        className='avatar myprofile-avatar'
                                        onClick={() => setSelectedImage(photoUrl)}
                                    />
                                    <div className='myprofile-identity-texts'>
                                        <div className='myprofile-display-name'>{name || t('name')}</div>
                                        <div className='myprofile-email-chip'>{currentUser?.email}</div>
                                    </div>
                                </div>

                                <div className='myprofile-upload-box'>
                                    <Form.Label>{t('profilepic')}</Form.Label>
                                    <Form.Control type='file' onChange={handleChange} className='myprofile-file-input' />
                                    <Button
                                        disabled={loading || !photo}
                                        type='button'
                                        text={t('upload')}
                                        className='btn btn-block myprofile-upload-btn'
                                        onClick={handleClick}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='col-12 col-lg-6'>
                            <div className='myprofile-fields'>
                                <Form.Group className='mb-3' controlId='myProfileFormDisplayName'>
                                    <Form.Label>{t('display_name')}</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder={t('name')}
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='myProfileFormUserName'>
                                    <Form.Label>{t('username')}</Form.Label>
                                    <Form.Control type='text' value={username} readOnly />
                                </Form.Group>

                                <Form.Group className='mb-3' controlId='myProfileFormHeight'>
                                    <Form.Label>{t('height')}</Form.Label>
                                    <Form.Control
                                        type='number'
                                        placeholder={t('height')}
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                    />
                                </Form.Group>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='row g-3'>
                    <div className='col-12 col-lg-6'>
                        <div className='content-card myprofile-sub-card'>
                            <h4 className='myprofile-card-title'>
                                <Icon name={ICONS.BELL} />
                                {t('settings_title')}
                            </h4>

                            <div className='myprofile-setting-row'>
                                <span>
                                    <Icon name={ICONS.BELL} />
                                    {t('notifications')}
                                </span>
                                <span className='myprofile-setting-value d-flex align-items-center gap-2'>
                                    <Form.Check type='switch' checked={false} disabled readOnly />
                                    {t('coming_soon')}
                                </span>
                            </div>

                            <div className='myprofile-setting-row'>
                                <span>
                                    <Icon name={ICONS.GLOBE} />
                                    {t('language')}
                                </span>
                                <Language />
                            </div>

                            <div className='myprofile-setting-row'>
                                <span>
                                    <Icon name={ICONS.SUN} />
                                    {t('theme')}
                                </span>
                                <ThemeToggler />
                            </div>

                            <Button
                                type='submit'
                                text={tCommon('buttons.button_save')}
                                className='btn btn-block saveBtn myprofile-save-btn'
                            />
                        </div>
                    </div>

                    <div className='col-12 col-lg-6'>
                        <div className='content-card myprofile-sub-card'>
                            <h4 className='myprofile-card-title'>
                                <Icon name={ICONS.ENVELOPE} />
                                {t('account_settings_title')}
                            </h4>

                            <div className='myprofile-setting-row'>
                                <span>{t('email')}</span>
                                <span className='myprofile-setting-value'>{currentUser?.email}</span>
                            </div>

                            <div className='myprofile-setting-row'>
                                <span>{t('password')}</span>
                                <span className='myprofile-setting-value'>********</span>
                            </div>

                            <div className='myprofile-setting-row myprofile-setting-row-danger'>
                                <span>{t('logout')}</span>
                                <Logout />
                            </div>
                        </div>
                    </div>
                </div>
            </Form>

            {selectedImage && <Modal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
        </PageContentWrapper>
    )
}



