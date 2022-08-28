//react
import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useTranslation } from "react-i18next";
//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//icon
import Icon from "../Icon";
//car
import AddFueling from "./AddFueling";
//firebase
import { ref, update, remove } from "firebase/database";
import { db } from "../../firebase-config";

function CarFueling({ fuelingRow, onDelete }) {

    //constants
    const DB_FUELING = 'car-fueling';

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

    //states
    const [editable, setEditable] = useState(false);

    const updateFueling = (fueling) => {
        const updates = {};
        fueling["modified"] = getCurrentDateAsJson();
        updates[`${DB_FUELING}/${fuelingRow.id}`] = fueling;
        update(ref(db), updates);
        setEditable(false);
    }

    return (
        <>
            <Row style={{ marginBottom: '5px', borderTop: '1px solid black' }}>
                <Col>
                    <b>{getJsonAsDateTimeString(fuelingRow.created, i18n.language)}</b>&nbsp;
                    {fuelingRow.createdBy}
                    <br />
                    {t('liter_amount')}: {fuelingRow.fuelLiterAmount} L<br />
                    {t('price')}: {fuelingRow.price} € <br />
                    {t('meter_kilometers')}: {fuelingRow.meterKilometers} km<br />
                    {t('fuel_price_simple')} {fuelingRow.fuelPricePerLiter} €/L<br />
                    {t('purchase_location')}: {fuelingRow.purchaseLocation}<br />
                    {t('fueler_name')}: {fuelingRow.fuelerName}

                    <span style={{ float: 'right' }}>
                        <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={() => editable ? setEditable(false) : setEditable(true)} />
                        <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={() => { if (window.confirm(t('delete_fueling_confirm_message'))) { onDelete(fuelingRow.id); } }} />
                    </span>
                </Col>
            </Row>
            <Row>
                <Col>
                    {editable &&
                        <AddFueling
                            ID={fuelingRow.id}
                            onClose={() => setEditable(false)}
                            onSave={updateFueling} />
                    }
                </Col>
            </Row>
        </>
    )
}

export default CarFueling