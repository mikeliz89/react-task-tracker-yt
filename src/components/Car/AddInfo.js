//react
import { Form, ButtonGroup, Row, Alert as BootstrapAlert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
//buttons
import Button from "../Button";
//auth
import { useAuth } from '../../contexts/AuthContext';
//firebase
import { onValue, ref, push, update } from "firebase/database";
import { db } from "../../firebase-config";
//utils
import { getJsonAsDateTimeString, getCurrentDateAsJson } from "../../utils/DateTimeUtils";
//i18n
import i18n from "i18next";
//pagetitle
import PageTitle from "../PageTitle";
//alert
import Alert from "../Alert";

const AddInfo = ({ onClose }) => {

    //constants
    const DB_INFO = 'car-info';

    //user
    const { currentUser } = useAuth();

    //states
    const [loading, setLoading] = useState(false);
    //states
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
    //car data states
    const [carId, setCarId] = useState('');
    const [registerNumber, setRegisterNumber] = useState('');
    const [modelYear, setModelYear] = useState(0);
    const [text, setText] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [modified, setModified] = useState('');

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

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
        const dbref = ref(db, `${DB_INFO}`);
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
            console.log(error)
            setError(t('failed_to_add_info'));
            setShowError(true);
        }

        setLoading(false)
    }

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
    }

    const updateInfo = (info) => {
        try {
            const updates = {};
            info["modified"] = getCurrentDateAsJson()
            updates[`${DB_INFO}/${carId}`] = info;
            update(ref(db), updates);
            showSuccess();
        } catch (ex) {
            showException(ex);
        }
    }

    const saveInfo = (info) => {
        try {
            if (carId !== '') {
                info["id"] = carId;
            }
            info["created"] = getCurrentDateAsJson();
            info["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_INFO);
            push(dbref, info);
            showSuccess();
        } catch (ex) {
            showException(ex);
        }
    }

    function showException(ex) {
        setError(t('save_exception'));
        console.warn(ex);
    }

    function showSuccess() {
        setMessage(t('save_successfull'));
        setShowMessage(true);
    }

    return (
        <div>
            <PageTitle title={t('add_info_title')} iconName='car' />
            {modified !== '' && <p style={{ marginBottom: '0' }}>{t('last_modified')}: {getJsonAsDateTimeString(modified, i18n.language)} &nbsp;</p>}

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

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
                        <Button
                            type='button'
                            text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button disabled={loading} type='submit' text={t('save')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </div>
    )
}

export default AddInfo
