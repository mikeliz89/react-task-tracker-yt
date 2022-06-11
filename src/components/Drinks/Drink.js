import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating';
import { FaTimes, FaGlassMartini } from 'react-icons/fa';

const Drink = ({ drink, onDelete }) => {

    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    return (
        <div key={drink.id} className='recipe'>
            <h5>
                <span>
                    <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {drink.title}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_drink_confirm_message'))) { onDelete(drink.id); } }} />
            </h5>
            {drink.category !== "" ? (<p> {'#' + drink.category}</p>) : ('')}
            <p>{drink.description}</p>
            <p><Link className='btn btn-primary' to={`/drink/${drink.id}`}>{t('view_details')}</Link></p>
            <StarRating starCount={drink.stars} />
        </div>
    )
}

export default Drink