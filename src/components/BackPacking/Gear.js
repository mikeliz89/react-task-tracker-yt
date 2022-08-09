//react
import { useTranslation } from 'react-i18next';
import { FaTimes, FaTripadvisor } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Alert } from 'react-bootstrap';
//utils
import { getGearCategoryNameByID } from '../../utils/ListUtils';

const Gear = ({ gear, onDelete }) => {

    //translation
    const { t } = useTranslation('backpacking', { keyPrefix: 'backpacking' });

    //states
    const [message] = useState('')
    const [showMessage, setShowMessage] = useState(false);
    const [error] = useState(false);

    return (
        <div key={gear.id} className='drink'>
            {error && <div className="error">{error}</div>}
            {message &&
                <Alert show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
                    </div>
                </Alert>}
            <h5>
                <span>
                    <FaTripadvisor style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
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