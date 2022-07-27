//react
import { Alert, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
//buttons
import Button from "../Button";
//auth
import { useAuth } from '../../contexts/AuthContext';
//firebase
import { ref, push } from "firebase/database";
import { db } from "../../firebase-config";
//utils
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";

const AddFueling = () => {

    //constants
    const DB_FUELING = 'car-fueling';

    //user
    const { currentUser } = useAuth();

    //states
    const [error, setError] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    //car data states
    const [purchaseLocation, setPurchaseLocation] = useState('');
    const [meterKilometers, setMeterKilometers] = useState(0);
    const [fuelPricePerLiter, setFuelPricePerLiter] = useState(0);
    const [fuelLiterAmount, setFuelLiterAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [fuelerName, setFuelerName] = useState('');

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

    async function onSubmit(e) {
        e.preventDefault()

        try {
            //clear
            setMessage('');
            setLoading(true);

            //save
            const fueling = {
                purchaseLocation, meterKilometers, fuelPricePerLiter,
                fuelLiterAmount, price, fuelerName
            };
            saveFueling(fueling);
        } catch (error) {
            setError(t('failed_to_add_fueling'));
            console.log(error)
        }

        setLoading(false);
        clearForm();
    }

    const clearForm = () => {
        setFuelerName('');
        setMeterKilometers(0);
        setFuelLiterAmount(0);
        setPurchaseLocation('');
        setFuelLiterAmount(0);
        setFuelPricePerLiter(0);
        setPrice(0);
    }

    const saveFueling = (fueling) => {

        try {
            fueling["created"] = getCurrentDateAsJson();
            fueling["createdBy"] = currentUser.email;
            const dbref = ref(db, DB_FUELING);
            push(dbref, fueling);
            setMessage(t('save_successfull'));
            setShowMessage(true);
        } catch (ex) {
            setError(t('save_exception'));
            console.warn(ex);
        }
    }

    return (
        <div>
            <h5>{t('add_fueling_title')}</h5>
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
                <Form.Group className="mb-3" controlId="addFuelingFormLiterAmount">
                    <Form.Label>{t('liter_amount')}</Form.Label>
                    <Form.Control type='number' placeholder={t('liter_amount')}
                        value={fuelLiterAmount} onChange={(e) => setFuelLiterAmount(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingFormPrice">
                    <Form.Label>{t('price')}</Form.Label>
                    <Form.Control type='number' placeholder={t('price')}
                        value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingFormMeterKilometers">
                    <Form.Label>{t('meter_kilometers')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='number' placeholder={t('meter_kilometers')}
                        value={meterKilometers} onChange={(e) => setMeterKilometers(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingFormFuelPrice">
                    <Form.Label>{t('fuel_price')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='number' placeholder={t('fuel_price')}
                        value={fuelPricePerLiter} onChange={(e) => setFuelPricePerLiter(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingFormPurchaseLocation">
                    <Form.Label>{t('purchase_location')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='text' placeholder={t('purchase_location')}
                        value={purchaseLocation} onChange={(e) => setPurchaseLocation(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingForm-FuelerName">
                    <Form.Label>{t('fueler_name')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='text' placeholder={t('fueler_name')}
                        value={fuelerName} onChange={(e) => setFuelerName(e.target.value)} />
                </Form.Group>
                <Button disabled={loading} type='submit' text={t('save')} className='btn btn-block' />
            </Form>
        </div>
    )
}

export default AddFueling
