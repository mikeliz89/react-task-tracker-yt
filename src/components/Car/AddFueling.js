import { ButtonGroup, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import Button from '../Buttons/Button';
import { onValue, ref } from "firebase/database";
import { db } from "../../firebase-config";
import * as Constants from '../../utils/Constants';
import FormTitle from '../Site/FormTitle';

export default function AddFueling({ ID, onClose, onSave }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    //states
    const [loading] = useState(false);

    //car data states
    const [purchaseLocation, setPurchaseLocation] = useState('');
    const [meterKilometers, setMeterKilometers] = useState(0);
    const [fuelPricePerLiter, setFuelPricePerLiter] = useState(0);
    const [fuelLiterAmount, setFuelLiterAmount] = useState(0);
    const [price, setPrice] = useState(0);
    const [fuelerName, setFuelerName] = useState('');
    const [created, setCreated] = useState('');
    const [createdBy, setCreatedBy] = useState('');

    //loadData
    useEffect(() => {
        if (ID != null) {
            const getFueling = async () => {
                await fetchFuelingFromFirebase(ID);
            }
            getFueling();
        }
    }, [ID]);

    const fetchFuelingFromFirebase = async (ID) => {
        const dbref = ref(db, `${Constants.DB_CAR_FUELING}/${ID}`);
        onValue(dbref, (snapshot) => {
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

    async function onSubmit(e) {
        e.preventDefault();

        const fueling = {
            created, createdBy,
            purchaseLocation, meterKilometers, fuelPricePerLiter,
            fuelLiterAmount, price, fuelerName
        };
        onSave(fueling);

        if (ID == null) {
            clearForm();
        }
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

    return (
        <div>
            <FormTitle title={t('add_fueling_title')} />

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