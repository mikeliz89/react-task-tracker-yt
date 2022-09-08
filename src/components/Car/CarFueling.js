import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import Icon from "../Icon";
import AddFueling from "./AddFueling";
import { updateToFirebaseById } from "../../datatier/datatier";

function CarFueling({ fuelingRow, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    //states
    const [editable, setEditable] = useState(false);

    const updateFueling = (fueling) => {
        fueling["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_CAR_FUELING, fuelingRow.id, fueling);
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