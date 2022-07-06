//react
import { Alert, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
//buttons
import Button from "../Button";
//auth
import { useAuth } from '../../contexts/AuthContext';
//firebase
import { onValue, ref, push } from "firebase/database";
import { db } from "../../firebase-config";
//utils
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";

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
    const [registerNumber, setRegisterNumber] = useState('');
    const [modelYear, setModelYear] = useState(0);
    const [text, setText] = useState('');

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
            const data = snapshot.val();
            console.log(data);
            console.log(data["registerNumber"]);
            if (data != null) {
                setRegisterNumber(data["registerNumber"]);
                setModelYear(data["modelYear"]);
                setText(data["text"]);
            }
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
                registerNumber, modelYear
            };
            saveInfo(info);
        } catch (error) {
            setError(t('failed_to_add_info'));
            console.log(error)
        }

        setLoading(false)
    }

    const saveInfo = (info) => {
        try {
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
