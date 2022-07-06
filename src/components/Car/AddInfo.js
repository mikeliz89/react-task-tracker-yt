//react
import { Alert, Form } from "react-bootstrap";
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

const AddInfo = () => {

    const DB_INFO = 'car-info';

    //user
    const { currentUser } = useAuth();

    //states
    const [error, setError] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
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

    /** Fetch Profile From Firebase */
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
            //clear
            setMessage('');
            setLoading(true);

            //save
            const info = {
                registerNumber, modelYear, text, created, createdBy
            };

            if (carId === '') {
                saveInfo(info);
            } else {
                updateInfo(info);
            }
        } catch (error) {
            setError(t('failed_to_add_info'));
            console.log(error)
        }

        setLoading(false)
    }

    const updateInfo = (info) => {
        try {
            const updates = {};
            info["modified"] = getCurrentDateAsJson()
            updates[`${DB_INFO}/${carId}`] = info;
            update(ref(db), updates);
            setMessage(t('save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
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
            const dbref = ref(db, DB_INFO);
            push(dbref, info);
            setMessage(t('save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            console.warn(ex);
        }
    }

    return (
        <div>
            <h5>{t('add_info_title')}</h5>
            {modified !== '' && <p style={{ marginBottom: '0' }}>{t('last_modified')}: {getJsonAsDateTimeString(modified, i18n.language)} &nbsp;</p>}
            {error && <div className="error">{error}</div>}
            {message &&
                <Alert show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>
            }
            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addInfoFormRegisterNumber">
                    <Form.Label>{t('register_number')}</Form.Label>
                    <Form.Control type='text' placeholder={t('register_number')}
                        value={registerNumber} onChange={(e) => setRegisterNumber(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoFormRegisterNumber">
                    <Form.Label>{t('model_year')}</Form.Label>
                    <Form.Control type='number' placeholder={t('model_year')}
                        value={modelYear} onChange={(e) => setModelYear(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addInfoFormText">
                    <Form.Label>{t('text')}</Form.Label>
                    <Form.Control type='text' placeholder={t('text')}
                        value={text} onChange={(e) => setText(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('save')} className='btn btn-block' />
            </Form>
        </div>
    )
}

export default AddInfo
