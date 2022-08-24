//react
import { Form, Row, ButtonGroup } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
//firebase
import { db } from '../../firebase-config';
import { ref, get } from "firebase/database";
//buttons
import Button from '../../components/Button';

export default function EditFueling({ ID, onEditFueling, onCloseEditFueling }) {

    //constants
    const DB_FUELING = 'car-fueling';

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

    //states
    const [loading, setLoading] = useState(false);

    //car data states
    const [fuelerName, setFuelerName] = useState('');
    const [fuelLiterAmount, setFuelLiterAmount] = useState(0);
    const [fuelPricePerLiter, setFuelPricePerLiter] = useState(0);
    const [meterKilometers, setMeterKilometers] = useState(0);
    const [price, setPrice] = useState(0);
    const [purchaseLocation, setPurchaseLocation] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    useEffect(() => {
        if (ID != null) {
            const getFueling = async () => {
                await fetchFuelingFromFirebase(ID);
            }
            getFueling();
        }
    }, [ID]);

    const fetchFuelingFromFirebase = async (ID) => {
        const dbref = ref(db, `${DB_FUELING}/${ID}`);
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                setCreated(val["created"]);
                setCreatedBy(val["createdBy"]);
                setFuelerName(val["fuelerName"]);
                setFuelLiterAmount(val["fuelLiterAmount"]);
                setFuelPricePerLiter(val["fuelPricePerLiter"]);
                setMeterKilometers(val["meterKilometers"]);
                setPrice(val["price"]);
                setPurchaseLocation(val["purchaseLocation"]);
            }
        });
    }

    const onSubmit = (e) => {
        e.preventDefault();
        let fueling = { id: ID, created, createdBy, fuelerName, fuelLiterAmount, fuelPricePerLiter, meterKilometers, price, purchaseLocation };
        onEditFueling(fueling);
    }

    return (
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
                        onClick={() => onCloseEditFueling()} />
                    <Button disabled={loading} type='submit' text={t('save')} className='btn btn-block saveBtn' />
                </ButtonGroup>
            </Row>
        </Form>
    )
}
