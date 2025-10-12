import { Row, Col, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import AddFueling from "./AddFueling";
import { updateToFirebaseById } from "../../datatier/datatier";
import RightWrapper from "../Site/RightWrapper";
import { useToggle } from '../useToggle';

export default function CarFueling({ fuelingRow, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    //modal
    const { status: showEditFueling, toggleStatus: toggleShowEditFueling } = useToggle();

    const updateFueling = (fueling) => {
        fueling["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.CAR_FUELING, fuelingRow.id, fueling);
        toggleShowEditFueling();
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
                    {t('meter_kilometers')}: {fuelingRow.meterKilometers > 0 ? fuelingRow.meterKilometers + ' km' : ''}<br />
                    {t('fuel_price_simple')}: {fuelingRow.fuelPricePerLiter} €/L<br />
                    {t('purchase_location')}: {fuelingRow.purchaseLocation}<br />
                    {t('fueler_name')}: {fuelingRow.fuelerName}
                    <RightWrapper>
                        <EditButton
                            editable={showEditFueling}
                            setEditable={toggleShowEditFueling}
                        />
                        <DeleteButton
                            onDelete={onDelete}
                            id={fuelingRow.id}
                        />
                    </RightWrapper>
                </Col>
            </Row>

            <Modal show={showEditFueling} onHide={toggleShowEditFueling}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_fueling')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddFueling
                        ID={fuelingRow.id}
                        onClose={() => toggleShowEditFueling()}
                        onSave={updateFueling} />
                </Modal.Body>
            </Modal>

        </>
    )
}