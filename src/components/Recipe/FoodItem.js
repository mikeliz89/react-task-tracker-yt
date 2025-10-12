import { FaCheckSquare } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddFoodItem from './AddFoodItem';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import { TRANSLATION } from '../../utils/Constants';
import RightWrapper from '../Site/RightWrapper';
import DeleteButton from '../Buttons/DeleteButton';
import EditButton from '../Buttons/EditButton';

export default function FoodItem({ foodItem, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);

    //translation
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

        <div className='listContainer'>
            <h5>
                <span>
                    {foodItem.name}
                </span>
                <RightWrapper>
                    <EditButton
                        editable={editable}
                        setEditable={setEditable}
                    />
                    <DeleteButton
                        onDelete={onDelete}
                        id={foodItem.id}
                    />
                </RightWrapper>
            </h5>
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
                {
                    foodItem.haveAtHome &&
                    <span
                        onClick={() => { markNotHaveAtHome() }}
                        className='btn btn-success' style={{ margin: '5px' }}>
                        {t('fooditem_have_at_home')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {
                    !foodItem.haveAtHome &&
                    <span
                        onClick={() => { markHaveAtHome() }}
                        className='btn btn-danger' style={{ margin: '5px' }}>
                        {t('fooditem_not_have_at_home')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {/* <Link className='btn btn-primary' to={`/recipe/${recipe.id}`}>{t('view_details')}</Link> */}
            </p>
        </div>
    )
}