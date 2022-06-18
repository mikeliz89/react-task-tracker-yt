//react
import { FaTimes, FaCheckSquare } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//firebase

const DrinkingProduct = ({ drinkingProduct, onDelete, onEdit }) => {

    //states
    const [error, setError] = useState(false);

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

    return (

        <div key={drinkingProduct.id} className='drink'>
            <h5>
                <span>
                    {drinkingProduct.name}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_drinkingproduct_confirm_message'))) { onDelete(drinkingProduct.id); } }} />
            </h5>
            {error && <div className="error">{error}</div>}
            <p>{t('drinkingproduct_manufacturer')}: {drinkingProduct.manufacturer}</p>
            <p>{t('drinkingproduct_description')}: {drinkingProduct.description}</p>
            <p>{t('drinkingproduct_category')}: {drinkingProduct.category}</p>
            <p>
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
                {/* <Link className='btn btn-primary' to={`/recipe/${recipe.id}`}>{t('view_details')}</Link> */}
            </p>
        </div>
    )
}

export default DrinkingProduct
