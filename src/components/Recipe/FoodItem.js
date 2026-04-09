

//translation

import { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { COLORS, ICONS, NAVIGATION, TRANSLATION } from '../../utils/Constants';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import CheckButton from '../Buttons/CheckButton';
import NavButton from '../Buttons/NavButton';
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
            headerLeft={
                <span>
                    <NavButton to={NAVIGATION.MANAGE_FOODITEMS} className=""
                        icon={ICONS.CARROT}
                        iconColor={COLORS.GRAY}
                    >
                        {foodItem.name}
                    </NavButton>
                </span>
            }
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={foodItem.id}
        >
            <p>{t('fooditem_calories')}: {foodItem.calories}</p>
            <p>{t('fooditem_category')}: {
                t('fooditem_category_' + getFoodItemCategoryNameByID(foodItem.category))
            }</p>
            {editable &&
                <AddFoodItem
                    onClose={() => setEditable(!editable)}
                    onAddFoodItem={editFoodItem}
                    foodItemID={foodItem.id} />
            }
            <p>
                <CheckButton
                    checked={foodItem.haveAtHome}
                    checkedText={t('fooditem_have_at_home')}
                    uncheckedText={t('fooditem_not_have_at_home')}
                    onCheck={markHaveAtHome}
                    onUncheck={markNotHaveAtHome}
                    style={{ margin: '5px' }}
                />
            </p>
        </ListRow>
    )
}



