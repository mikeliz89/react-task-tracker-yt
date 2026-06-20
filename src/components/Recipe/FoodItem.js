import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { COLORS, ICONS, NAVIGATION, TRANSLATION, DB } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import { updateToFirebaseById } from '../../datatier/datatier';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';

import ListRow from '../Site/ListRow';
import AddFoodItem from './AddFoodItem';

export default function FoodItem({ item, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });

    const updateFooditem = (updateFooditemID, object) => {
        object["modified"] = getCurrentDateAsJson();
        updateToFirebaseById(DB.FOODITEMS, updateFooditemID, object);
        setEditable(false);
    }

    return (
        <ListRow
            item={item}
            dbKey={DB.FOODITEMS}
            headerProps={{
                title: item.name,
                titleTo: `${NAVIGATION.FOODITEM_DETAILS}/${item.id}`,
                icon: ICONS.CARROT,
                iconColor: COLORS.GRAY
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <>
                    <p>{t('fooditem_calories')}: {item.calories}</p>
                    <p>{t('fooditem_category')}: {
                        t('fooditem_category_' + getFoodItemCategoryNameByID(item.category))
                    }</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_fooditem'),
                modalBody: (
                    <AddFoodItem
                        onClose={() => setEditable(false)}
                        onSave={updateFooditem}
                        foodItemID={item.id}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: item.haveAtHome,
                checkedText: t('fooditem_have_at_home'),
                uncheckedText: t('fooditem_not_have_at_home'),
                onCheck: () => { item["haveAtHome"] = true; onEdit(item); },
                onUncheck: () => { item["haveAtHome"] = false; onEdit(item); }
            }}
        />
    );
}



