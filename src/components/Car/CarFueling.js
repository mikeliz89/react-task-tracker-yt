//modal
import i18n from "i18next";
import { Row, Col, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import { updateToFirebaseById } from "../../datatier/datatier";
import { TRANSLATION, DB } from '../../utils/Constants';
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';
import { useToggle } from '../Hooks/useToggle';

import RightWrapper from "../Site/RightWrapper";
import ListRow from '../Site/ListRow';
import AddFueling from "./AddFueling";

export default function CarFueling({ fuelingRow, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    const { status: showEditFueling, toggleStatus: toggleShowEditFueling } = useToggle();

    const updateFueling = (fueling) => {
        fueling["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.CAR_FUELING, fuelingRow.id, fueling);
        toggleShowEditFueling();
    };

    return (
        <>
            <ListRow
                headerTitle={
                    <>
                        <b>{getJsonAsDateTimeString(fuelingRow.created, i18n.language)}</b>&nbsp;
                        {fuelingRow.createdBy}
                    </>
                }
                showEditButton={true}
                editable={showEditFueling}
                setEditable={toggleShowEditFueling}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={fuelingRow.id}
            >
                <div>
                    {t('liter_amount')}: {fuelingRow.fuelLiterAmount} L<br />
                    {t('price')}: {fuelingRow.price} € <br />
                    {t('meter_kilometers')}: {fuelingRow.meterKilometers > 0 ? fuelingRow.meterKilometers + ' km' : ''}<br />
                    {t('fuel_price_simple')}: {fuelingRow.fuelPricePerLiter} €/L<br />
                    {t('purchase_location')}: {fuelingRow.purchaseLocation}<br />
                    {t('fueler_name')}: {fuelingRow.fuelerName}
                </div>
            </ListRow>

            <Modal show={showEditFueling} onHide={toggleShowEditFueling}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_fueling')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddFueling
                        ID={fuelingRow.id}
                        onClose={() => toggleShowEditFueling()}
                        onSave={updateFueling}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
}


