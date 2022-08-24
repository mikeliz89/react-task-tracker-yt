//react
import { ButtonGroup, Form, Row } from "react-bootstrap";
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
//alert
import Alert from "../Alert";

const AddFueling = ({ onClose }) => {

    //constants
    const DB_FUELING = 'car-fueling';

    //user
    const { currentUser } = useAuth();

    //states
    const [loading, setLoading] = useState(false);
    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');
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
            setLoading(true);
            clearMessages();
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

    function clearMessages() {
        setError('');
        setShowError(false);
        setMessage('');
        setShowMessage(false);
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
            setShowError(true);
            console.warn(ex);
        }
    }

    return (
        <div>
            <h5>{t('add_fueling_title')}</h5>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <Form onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="addFuelingForm-LiterAmount">
                    <Form.Label>{t('liter_amount')}</Form.Label>
                    <Form.Control type='number' placeholder={t('liter_amount')}
                        value={fuelLiterAmount} onChange={(e) => setFuelLiterAmount(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingForm-Price">
                    <Form.Label>{t('price')}</Form.Label>
                    <Form.Control type='number' placeholder={t('price')}
                        value={price} onChange={(e) => setPrice(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingForm-MeterKilometers">
                    <Form.Label>{t('meter_kilometers')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='number' placeholder={t('meter_kilometers')}
                        value={meterKilometers} onChange={(e) => setMeterKilometers(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingForm-FuelPrice">
                    <Form.Label>{t('fuel_price')}</Form.Label>
                    <Form.Control
                        autoComplete="off"
                        type='number' placeholder={t('fuel_price')}
                        value={fuelPricePerLiter} onChange={(e) => setFuelPricePerLiter(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addFuelingForm-PurchaseLocation">
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
                <Row>
                    <ButtonGroup>
                        <Button
                            type='button' text={t('button_close')} className='btn btn-block'
                            onClick={() => onClose()} />
                        <Button disabled={loading} type='submit' text={t('save')} className='btn btn-block saveBtn' />
                    </ButtonGroup>
                </Row>
            </Form>
        </div >
    )
}

export default AddFueling
