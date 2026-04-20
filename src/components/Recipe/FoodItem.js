import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { COLORS, ICONS, NAVIGATION, TRANSLATION } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import ListRow from '../Site/ListRow';

import AddFoodItem from './AddFoodItem';

export default function FoodItem({ foodItem, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });

    const markHaveAtHome = () => {
        foodItem["haveAtHome"] = true;
        onEdit(foodItem);
    }

    const markNotHaveAtHome = () => {
        foodItem["haveAtHome"] = false;
        onEdit(foodItem);
    }

    const editFoodItem = (editedFoodItem) => {
        editedFoodItem["id"] = foodItem.id;
        onEdit(editedFoodItem);
    }

    return (
        <ListRow
            headerTitle={foodItem.name}
            headerTitleTo={`${NAVIGATION.FOODITEM_DETAILS}/${foodItem.id}`}
            headerTitleIcon={ICONS.CARROT}
            headerTitleIconColor={COLORS.GRAY}
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
            modalTitle={t('modal_header_edit_fooditem')}
            modalBody={
                <AddFoodItem
                    onClose={() => setEditable(false)}
                    onAddFoodItem={editFoodItem}
                    foodItemID={foodItem.id}
                />
            }
        >
            <CheckButton
                checked={foodItem.haveAtHome}
                checkedText={t('fooditem_have_at_home')}
                uncheckedText={t('fooditem_not_have_at_home')}
                onCheck={markHaveAtHome}
                onUncheck={markNotHaveAtHome}
                style={{ margin: '5px' }}
            />
        </ListRow>
    )
}



