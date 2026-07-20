import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, VARIANTS, COLORS, DB } from "../../utils/Constants";
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import { getIconNameByCategory } from './Categories';
import { useState } from 'react';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import AddGear from './AddGear';

export default function Gear({ item, onDelete, onEdit }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.BACKPACKING });
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages
    } = useAlert();
    const [editable, setEditable] = useState(false);
    const updateGear = (updateGearID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.BACKPACKING_GEAR, updateGearID, object);
        setEditable(false);
    }

    return (
        <>
            <ListRow
                item={item}
                dbKey={DB.BACKPACKING_GEAR}
                headerProps={{
                    title: item.name,
                    titleTo: `${NAVIGATION.GEAR}/${item.id}`,
                    titleIcon: getIconNameByCategory(item.category),
                    titleIconColor: COLORS.GRAY
                }}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={item.id}
                alert={{
                    message,
                    showMessage,
                    error,
                    showError,
                    variant: VARIANTS.SUCCESS,
                    onClose: clearMessages,
                }}
                modalProps={{
                    modalTitle: t('modal_header_edit_gear'),
                    modalBody: (
                        <AddGear
                            gearID={item.id}
                            onSave={updateGear}
                            onClose={() => setEditable(false)}
                            showLabels={true}
                        />
                    )
                }}
                section={
                    <>
                        {item.category !== "" ? (
                            <p> {'#' + t('gear_category_' + getGearCategoryNameByID(item.category))}</p>
                        ) : ('')}
                        <p>{t('gear_weight')}: {item.weightInGrams} g</p>
                    </>
                }
                showCheckButton={true}
                checkButtonProps={{
                    checked: !!item.haveAtHome,
                    //checkedText: t('gear_have_at_home'),
                    //uncheckedText: t('gear_not_have_at_home'),
                    onCheck: () => { item["haveAtHome"] = true; onEdit(item); },
                    onUncheck: () => { item["haveAtHome"] = false; onEdit(item); },
                }}
            />
        </>
    );
}



