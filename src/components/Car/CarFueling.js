import { Row, Col, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import Icon from "../Icon";
import AddFueling from "./AddFueling";
import { updateToFirebaseById } from "../../datatier/datatier";
import RightWrapper from "../Site/RightWrapper";
import { useToggle } from '../UseToggle';

export default function CarFueling({ fuelingRow, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_CAR, { keyPrefix: Constants.TRANSLATION_CAR });

    //modal
    const { status: showEditFueling, toggleStatus: toggleShowEditFueling } = useToggle();

    const updateFueling = (fueling) => {
        fueling["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(Constants.DB_CAR_FUELING, fuelingRow.id, fueling);
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
                        <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                            style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={() => toggleShowEditFueling()} />
                        <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                            style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                            onClick={() => { if (window.confirm(t('delete_fueling_confirm_message'))) { onDelete(fuelingRow.id); } }} />
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