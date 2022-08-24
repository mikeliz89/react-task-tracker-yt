//react
import { FaCheckSquare } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//drinking product
import AddDrinkingProduct from './AddDrinkingProduct';
//utils
import { getDrinkingProductCategoryNameByID } from '../../utils/ListUtils';
//icons
import Icon from '../Icon';

const DrinkingProduct = ({ drinkingProduct, onDelete, onEdit }) => {

    //states
    const [editable, setEditable] = useState(false);

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

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

        <div className='drink'>
            <h5>
                <span>
                    <Icon name='cocktail' color='gray' />
                    {drinkingProduct.name}
                </span>
                <span style={{ float: 'right' }}>
                    <Icon name='edit' className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => { if (window.confirm(t('delete_drinkingproduct_confirm_message'))) { onDelete(drinkingProduct.id); } }} />
                </span>
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
                <Link className='btn btn-primary' to={`/drinkingproduct/${drinkingProduct.id}`}>{t('view_details')}</Link>
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
        </div>
    )
}

export default DrinkingProduct
