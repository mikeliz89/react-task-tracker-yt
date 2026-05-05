import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { COLORS, ICONS, NAVIGATION, TRANSLATION, DB } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';

import ListRow from '../Site/ListRow';
import AddFoodItem from './AddFoodItem';

export default function FoodItem({ foodItem, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });

    const editFoodItem = (editedFoodItem) => {
        editedFoodItem["id"] = foodItem.id;
        onEdit(editedFoodItem);
    }

    return (
        <ListRow
            item={foodItem}
            dbKey={DB.FOODITEMS}
            headerProps={{
                title: foodItem.name,
                titleTo: `${NAVIGATION.FOODITEM_DETAILS}/${foodItem.id}`,
                icon: ICONS.CARROT,
                iconColor: COLORS.GRAY
            }}
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={foodItem.id}
            section={
                <>
                    <p>{t('fooditem_calories')}: {foodItem.calories}</p>
                    <p>{t('fooditem_category')}: {
                        t('fooditem_category_' + getFoodItemCategoryNameByID(foodItem.category))
                    }</p>
                </>
            }
            modalProps={{
                modalTitle: t('modal_header_edit_fooditem'),
                modalBody: (
                    <AddFoodItem
                        onClose={() => setEditable(false)}
                        onSave={editFoodItem}
                        foodItemID={foodItem.id}
                    />
                )
            }}
            showCheckButton={true}
            checkButtonProps={{
                checked: foodItem.haveAtHome,
                checkedText: t('fooditem_have_at_home'),
                uncheckedText: t('fooditem_not_have_at_home'),
                onCheck: () => { foodItem["haveAtHome"] = true; onEdit(foodItem); },
                onUncheck: () => { foodItem["haveAtHome"] = false; onEdit(foodItem); },
                style: { margin: '5px' }
            }}
        />
    )
}



