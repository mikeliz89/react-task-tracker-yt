import { FaCheckSquare } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddFoodItem from './AddFoodItem';
import { getFoodItemCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import Icon from '../Icon';
import RightWrapper from '../Site/RightWrapper';

export default function FoodItem({ foodItem, onDelete, onEdit }) {

    //states
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_RECIPE });

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
                    <Icon name={Constants.ICON_EDIT} className={Constants.CLASSNAME_EDITBTN}
                        style={{ color: Constants.COLOR_LIGHT_GRAY, cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon name={Constants.ICON_DELETE} className={Constants.CLASSNAME_DELETEBTN}
                        style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => { if (window.confirm(t('delete_fooditem_confirm_message'))) { onDelete(foodItem.id); } }} />
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