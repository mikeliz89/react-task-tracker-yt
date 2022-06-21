//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaTimes, FaWeight } from 'react-icons/fa';
import { useState } from 'react'
//star rating
import StarRating from '../StarRating/StarRating';

const Exercise = ({ exercise, onDelete }) => {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //states 
    const [error, setError] = useState('');

    return (
        <div key={exercise.id} className='exercise'>
            <h5>
                <span>
                    <FaWeight style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {exercise.date} {exercise.time}
                </span>
                {exercise.category !== "" ? (<p> {'#' + exercise.category}</p>) : ('')}
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(exercise.id); } }} />
            </h5>
            {error && <div className="error">{error}</div>}
            <p>
                <Link className='btn btn-primary' to={`/exercise/${exercise.id}`}>{t('view_details')}</Link>
            </p>
            <StarRating starCount={exercise.stars} />
        </div>
    )
}

export default Exercise