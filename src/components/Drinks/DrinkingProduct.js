import { FaCheckSquare } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import AddDrinkingProduct from './AddDrinkingProduct';
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import Icon from '../Icon';
import RightWrapper from '../Site/RightWrapper';
import StarRating from '../StarRating/StarRating';

const DrinkingProduct = ({ drinkingProduct, onDelete, onEdit }) => {

    //states
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

    const markHaveAtHome = () => {
        drinkingProduct["haveAtHome"] = true;
        onEdit(drinkingProduct);
    }

    const markNotHaveAtHome = () => {
        drinkingProduct["haveAtHome"] = false;
        onEdit(drinkingProduct);
    }

    const editDrinkingProduct = (editedDrinkingProduct) => {
        editedDrinkingProduct["id"] = drinkingProduct.id;
        onEdit(editedDrinkingProduct);
    }

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    <Icon name={Constants.ICON_COCKTAIL} color='gray' />
                    {drinkingProduct.name + (drinkingProduct.abv > 0 ? ' (' + drinkingProduct.abv + '%)' : '')}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon name={Constants.ICON_DELETE} className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => { if (window.confirm(t('delete_drinkingproduct_confirm_message'))) { onDelete(drinkingProduct.id); } }} />
                </RightWrapper>
            </h5>
            <p>{t('drinkingproduct_manufacturer')}: {drinkingProduct.manufacturer}</p>
            <p>{t('drinkingproduct_description')}: {drinkingProduct.description}</p>
            <p>{t('drinkingproduct_category')}: {
                t('drinkingproduct_category_' + getDrinkingProductCategoryNameByID(drinkingProduct.category))
            }</p>
            {editable &&
                <AddDrinkingProduct
                    onClose={() => setEditable(!editable)}
                    onAddDrinkingProduct={editDrinkingProduct}
                    drinkingProductID={drinkingProduct.id} />
            }
            <p>
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_DRINKINGPRODUCT}/${drinkingProduct.id}`}>{t('view_details')}</Link>
                {
                    drinkingProduct.haveAtHome &&
                    <span
                        onClick={() => { markNotHaveAtHome() }}
                        className='btn btn-success' style={{ margin: '5px' }}>
                        {t('drinkingproduct_have_at_home')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
                {
                    !drinkingProduct.haveAtHome &&
                    <span
                        onClick={() => { markHaveAtHome() }}
                        className='btn btn-danger' style={{ margin: '5px' }}>
                        {t('drinkingproduct_not_have_at_home')}&nbsp;
                        <FaCheckSquare style={{ cursor: 'pointer', fontSize: '1.2em' }} />
                    </span>
                }
            </p>
            <StarRating starCount={drinkingProduct.stars} />
        </div>
    )
}

export default DrinkingProduct
