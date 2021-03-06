//react
import { FaTimes, FaCheckSquare, FaEdit } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//recipe
import AddFoodItem from './AddFoodItem';
//utils
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';

const FoodItem = ({ foodItem, onDelete, onEdit }) => {

    //states
    const [error, setError] = useState(false);
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

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

        <div key={foodItem.id} className='drink'>
            <h5>
                <span>
                    {foodItem.name}
                </span>

                <span style={{ float: 'right' }}>
                    <FaEdit className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => { if (window.confirm(t('delete_fooditem_confirm_message'))) { onDelete(foodItem.id); } }} />
                </span>

            </h5>
            {error && <div className="error">{error}</div>}
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

export default FoodItem
