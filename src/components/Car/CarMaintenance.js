//states
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import { updateToFirebaseById } from "../../datatier/datatier";
import { TRANSLATION, DB } from '../../utils/Constants';
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useToggle } from '../Hooks/useToggle';

import ListRow from '../Site/ListRow';

import AddMaintenance from "./AddMaintenance";

export default function CarMaintenance({ carMaintenance, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.CAR });

    const { status: editable, toggleStatus: toggleEditable, setFalse } = useToggle();

    const updateMaintenance = (maintenance) => {
        maintenance["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.CAR_MAINTENANCE, carMaintenance.id, maintenance);
        setFalse(); //Sulje edit tila
    };

    return (
        <ListRow
            headerTitle={
                <>
                    <b>{getJsonAsDateTimeString(carMaintenance.created, i18n.language)}</b>&nbsp;
                    {carMaintenance.createdBy}
                </>
            }
            showEditButton={true}
            editable={editable}
            setEditable={toggleEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={carMaintenance.id}
            section={
                <div>
                    {t('maintenance_name')}: {carMaintenance.name} <br />
                    {t('maintenance_description')}: {carMaintenance.description} <br />
                    {t('maintenance_price')}: {carMaintenance.price} <br />
                </div>
            }
            modalTitle={t('modal_header_edit_maintenance')}
            modalBody={
                <AddMaintenance
                    ID={carMaintenance.id}
                    onClose={() => toggleEditable()}
                    onSave={updateMaintenance}
                />
            }
        />
    );
}


