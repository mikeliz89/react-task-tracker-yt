import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, VARIANTS, COLORS, DB } from "../../utils/Constants";
import { getGearCategoryNameByID } from '../../utils/ListUtils';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import { getIconNameByCategory } from './Categories';
import { useState } from 'react';
import AddGear from './AddGear';

export default function Gear({ gear, onDelete, onEdit }) {

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

    const updateGear = (object) => {
        if (typeof onEdit === 'function') {
            onEdit(object);
        }
        setEditable(false);
    }

    return (
        <>
            <ListRow
                item={gear}
                dbKey={DB.BACKPACKING_GEAR}
                headerProps={{
                    title: gear.name,
                    titleTo: `${NAVIGATION.GEAR}/${gear.id}`,
                    titleIcon: getIconNameByCategory(gear.category),
                    titleIconColor: COLORS.GRAY
                }}
                showEditButton={true}
                editable={editable}
                setEditable={setEditable}
                showDeleteButton={true}
                onDelete={onDelete}
                deleteId={gear.id}
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
                            gearID={gear.id}
                            onSave={updateGear}
                            onClose={() => setEditable(false)}
                            showLabels={true}
                        />
                    )
                }}
                section={
                    <>
                        {gear.category !== "" ? (
                            <p> {'#' + t('gear_category_' + getGearCategoryNameByID(gear.category))}</p>
                        ) : ('')}
                        <p>{t('gear_weight')}: {gear.weightInGrams} g</p>
                    </>
                }
                showCheckButton={true}
                checkButtonProps={{
                    checked: !!gear.haveAtHome,
                    checkedText: t('gear_have_at_home'),
                    uncheckedText: t('gear_not_have_at_home'),
                    onCheck: () => { gear["haveAtHome"] = true; onEdit(gear); },
                    onUncheck: () => { gear["haveAtHome"] = false; onEdit(gear); },
                }}
            />
        </>
    );
}



