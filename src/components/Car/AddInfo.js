import { onValue, ref } from "firebase/database";
import i18n from "i18next";
import { useState, useEffect } from "react";
import { Form, ButtonGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { useAuth } from '../../contexts/AuthContext';
import { updateToFirebase, updateToFirebaseById } from "../../datatier/datatier";
import { db } from "../../firebase-config";
import { TRANSLATION, DB, ICONS, VARIANTS } from '../../utils/Constants';
import { getJsonAsDateTimeString, getCurrentDateAsJson } from "../../utils/DateTimeUtils";
import Alert from "../Alert";
import Button from '../Buttons/Button';
import { useAlert } from "../Hooks/useAlert";
import PageTitle from '../Site/PageTitle';

export default function AddInfo({ carId }) {

    //user
    const { currentUser } = useAuth();

    //states
    const [loading, setLoading] = useState(false);

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //car data states
    const [brand, setBrand] = useState('');
    const [modelName, setModelName] = useState('');
    const [modelYear, setModelYear] = useState(0);
    const [registerNumber, setRegisterNumber] = useState('');
    const [text, setText] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [modified, setModified] = useState('');

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //load data
    useEffect(() => {
        if (!carId) {
            return;
        }

        let isMounted = true;
        const getCarInfo = async () => {
            if (isMounted) {
                await fetchCarFromFirebase();
                await fetchCarInfoFromFirebase();
            }
        }
        getCarInfo()
        return () => { isMounted = false };
    }, [carId]);

    const fetchCarFromFirebase = async () => {
        const dbref = ref(db, `${DB.CARS}/${carId}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                if (data["brand"] !== undefined) {
                    setBrand(data["brand"]);
                }
                if (data["modelName"] !== undefined) {
                    setModelName(data["modelName"]);
                }
            }
        })
    }

    const fetchCarInfoFromFirebase = async () => {
        const dbref = ref(db, `${DB.CAR_INFO}/${carId}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data != null) {
                if (data["registerNumber"] !== undefined) {
                    setRegisterNumber(data["registerNumber"]);
                }
                if (data["modelYear"] !== undefined) {
                    setModelYear(data["modelYear"]);
                }
                if (data["text"] !== undefined) {
                    setText(data["text"]);
                }
                if (data["created"] !== undefined) {
                    setCreated(data["created"]);
                }
                if (data["createdBy"] !== undefined) {
                    setCreatedBy(data["createdBy"]);
                }
                if (data["modified"] !== undefined) {
                    setModified(data["modified"]);
                }
            }
        })
    }

    async function onSubmit(e) {
        e.preventDefault()

        try {
            setLoading(true);

            clearMessages();

            const info = {
                registerNumber, modelYear, text, created, createdBy
            };

            updateInfo(info);
        } catch (error) {
            showFailure(t('failed_to_add_info'));
            console.warn(error);
        }

        setLoading(false)
    }

    const updateInfo = (info) => {
        try {
            if (!info["created"]) {
                info["created"] = getCurrentDateAsJson();
            }
            if (!info["createdBy"]) {
                info["createdBy"] = currentUser.email;
            }
            info["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.CAR_INFO, carId, info);

            updateToFirebase({
                [`${DB.CARS}/${carId}/brand`]: brand,
                [`${DB.CARS}/${carId}/modelName`]: modelName,
            });

            showSuccess(t('save_successful'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    return (
        <div>
            <PageTitle title={t('add_info_title')} iconName={ICONS.CAR} />
            {modified !== '' && <p style={{ marginBottom: '0' }}>{t('last_modified')}: {getJsonAsDateTimeString(modified, i18n.language)} &nbsp;</p>}

            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addInfoForm-Brand">
                    <Form.Label>{t('brand')}</Form.Label>
                    <Form.Control type='text' placeholder={t('brand')}
                        value={brand} onChange={(e) => setBrand(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoForm-ModelName">
                    <Form.Label>{t('model_name')}</Form.Label>
                    <Form.Control type='text' placeholder={t('model_name')}
                        value={modelName} onChange={(e) => setModelName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoForm-RegisterNumber">
                    <Form.Label>{t('register_number')}</Form.Label>
                    <Form.Control type='text' placeholder={t('register_number')}
                        value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoForm-ModelYear">
                    <Form.Label>{t('model_year')}</Form.Label>
                    <Form.Control type='number' placeholder={t('model_year')}
                        value={modelYear} onChange={(e) => setModelYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoForm-Text">
                    <Form.Label>{t('text')}</Form.Label>
                    <Form.Control type='text' placeholder={t('text')}
                        value={text} onChange={(e) => setText(e.target.value)} />
                </Form.Group>
                <Row>
                    <ButtonGroup>
                        <Button disabled={loading} type='submit' text={tCommon('buttons.button_save')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </div>
    )
}



