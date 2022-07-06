//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//react
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CarFuelings = ({ carFuelings }) => {

    //translation
    const { t } = useTranslation('car', { keyPrefix: 'car' });

    return (
        <>
            <h5>{t('fuelings')}</h5>
            {carFuelings.map((fuelingRow) => (
                <Row key={fuelingRow.id} style={{ marginBottom: '5px', borderTop: '1px solid black' }}>
                    <Col>
                        {getJsonAsDateTimeString(fuelingRow.created, i18n.language)} &nbsp;
                        {fuelingRow.createdBy}<br />
                        {t('liter_amount')}: {fuelingRow.fuelLiterAmount} L<br />
                        {t('price')}: {fuelingRow.price} € <br />
                        {t('meter_kilometers')}: {fuelingRow.meterKilometers} km<br />
                        {t('fuel_price_simple')} {fuelingRow.fuelPricePerLiter} €/L<br />
                        {t('purchase_location')}: {fuelingRow.purchaseLocation}
                    </Col>
                </Row>
            ))}
        </>
    )
}

export default CarFuelings
