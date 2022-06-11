import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const DrinkIncredient = ({ drinkIncredient, onDelete }) => {

    //states
    const [error, setError] = useState(false);

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    return (

        <div key={drinkIncredient.id} className='recipe'>
            <h5>
                <span>
                    {drinkIncredient.name}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_incredient_confirm_message'))) { onDelete(drinkIncredient.id); } }} />
            </h5>
            {error && <div className="error">{error}</div>}
            <p>{t('incredient_manufacturer')}: {drinkIncredient.manufacturer}</p>
            <p>{t('incredient_description')}: {drinkIncredient.description}</p>
            <p>{t('category')}: {drinkIncredient.category}</p>
            <p>
                {/* <Link className='btn btn-primary' to={`/recipe/${recipe.id}`}>{t('view_details')}</Link> */}
            </p>
        </div>
    )
}

export default DrinkIncredient
