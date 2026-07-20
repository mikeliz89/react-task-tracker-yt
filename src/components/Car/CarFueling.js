import i18n from "i18next";
import { useTranslation } from "react-i18next";

import { updateToFirebaseById } from "../../datatier/datatier";
import { TRANSLATION, DB } from '../../utils/Constants';
import { getJsonAsDateString, getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useToggle } from '../Hooks/useToggle';

import ListRow from '../Site/ListRow';
import AddFueling from "./AddFueling";

export default function CarFueling({ carId, fuelingRow, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    const { status: showEditFueling, toggleStatus: toggleShowEditFueling } = useToggle();

    const updateFueling = (fueling) => {
        fueling["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(`${DB.CAR_FUELING}/${carId}`, fuelingRow.id, fueling);
        toggleShowEditFueling();
    };

    return (
        <ListRow
            item={fuelingRow}
            dbKey={`${DB.CAR_FUELING}/${carId}`}
            headerProps={{
                title: (
                    <>
                        <b>{getJsonAsDateTimeString(fuelingRow.created, i18n.language)}</b>&nbsp;
                        {fuelingRow.createdBy}
                    </>
                )
            }}
            showEditButton={true}
            editable={showEditFueling}
            setEditable={toggleShowEditFueling}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={fuelingRow.id}
            showSetStarRating={false}
            showStarRating={false}
            section={
                <div>
                    {t('fueling_date')}: {getJsonAsDateString(fuelingRow.fuelingDate, i18n.language)}<br />
                    {t('liter_amount')}: {fuelingRow.fuelLiterAmount} L<br />
                    {t('price')}: {fuelingRow.price} € <br />
                    {t('meter_kilometers')}: {fuelingRow.meterKilometers > 0 ? fuelingRow.meterKilometers + ' km' : ''}<br />
                    {t('fuel_price_simple')}: {fuelingRow.fuelPricePerLiter} €/L<br />
                    {t('purchase_location')}: {fuelingRow.purchaseLocation}<br />
                    {t('fueler_name')}: {fuelingRow.fuelerName}
                </div>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_fueling'),
                modalBody: (
                    < AddFueling
                        carId={carId}
                        ID={fuelingRow.id}
                        onClose={() => toggleShowEditFueling()
                        }
                        onSave={updateFueling}
                    />
                )
            }}

        />
    );
}


