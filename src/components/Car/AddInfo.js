import { Form, ButtonGroup, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Button from '../Buttons/Button';
import { useAuth } from '../../contexts/AuthContext';
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase-config";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from "../../utils/DateTimeUtils";
import { TRANSLATION, DB, ICONS, VARIANTS } from '../../utils/Constants';
import i18n from "i18next";
import PageTitle from '../Site/PageTitle';
import Alert from "../Alert";
import { pushToFirebase, updateToFirebaseById } from "../../datatier/datatier";
import { useAlert } from "../Hooks/useAlert";

export default function AddInfo() {

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
    const [carId, setCarId] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [modelYear, setModelYear] = useState(0);
    const [text, setText] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [modified, setModified] = useState('');

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //load data
    useEffect(() => {
        let isMounted = true;
        const getCarInfo = async () => {
            if (isMounted)
                await fetchCarInfoFromFirebase();
        }
        getCarInfo()
        return () => { isMounted = false };
    }, []);

    const fetchCarInfoFromFirebase = async () => {
        const dbref = ref(db, `${DB.CAR_INFO}`);
        onValue(dbref, (snapshot) => {
            snapshot.forEach(function (child) {
                const key = child.key;
                const data = child.val();
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
                setCarId(key);
            });
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

            if (carId === '') {
                saveInfo(info);
            } else {
                updateInfo(info);
            }
        } catch (error) {
            showFailure(t('failed_to_add_info'));
            console.warn(error);
        }

        setLoading(false)
    }

    const updateInfo = (info) => {
        try {
            info["modified"] = getCurrentDateAsJson();
            updateToFirebaseById(DB.CAR_INFO, carId, info);
            showSuccess(t('save_successful'));
        } catch (ex) {
            showFailure(t('save_exception'));
            console.warn(ex);
        }
    }

    const saveInfo = (info) => {
        try {
            if (carId !== '') {
                info["id"] = carId;
            }
            info["created"] = getCurrentDateAsJson();
            info["createdBy"] = currentUser.email;
            pushToFirebase(DB.CAR_INFO, info);
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

            <Alert message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                variant={VARIANTS.SUCCESS}
                onClose={clearMessages}
            />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addInfoForm-RegisterNumber">
                    <Form.Label>{t('register_number')}</Form.Label>
                    <Form.Control type='text' placeholder={t('register_number')}
                        value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoForm-RegisterNumber">
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
