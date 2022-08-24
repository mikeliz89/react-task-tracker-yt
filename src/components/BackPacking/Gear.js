//react
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
//utils
import { getGearCategoryNameByID } from '../../utils/ListUtils';
//icons
import Icon from '../Icon';
//alert
import Alert from '../Alert';
//categories
import { getIconNameByCategory } from './Categories';

const Gear = ({ gear, onDelete }) => {

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('')
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    return (
        <div key={gear.id} className='drink'>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            <h5>
                <span>
                    <Icon name={getIconNameByCategory(gear.category)} />
                    {gear.name}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_gear_confirm_message'))) { onDelete(gear.id); } }} />
            </h5>
            {gear.category !== "" ? (
                <p> {'#' + t('gear_category_' + getGearCategoryNameByID(gear.category))}</p>
            ) : ('')}
            <p>{t('gear_weight')}: {gear.weightInGrams} g</p>
            <p>
                <Link className='btn btn-primary' to={`/gear/${gear.id}`}>{t('view_details')}</Link>
            </p>
        </div>
    )
}

export default Gear