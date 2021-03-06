//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaTimes, FaRunning, FaWalking, FaDumbbell } from 'react-icons/fa';
import { useState } from 'react'
//star rating
import StarRating from '../StarRating/StarRating';
//categories
import { Categories } from './Categories';
//utils
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import { getDateAndTimeAsDateTimeString } from '../../utils/DateTimeUtils';
//i18n
import i18n from "i18next";

const Exercise = ({ exercise, onDelete }) => {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //states 
    const [error, setError] = useState('');

    return (
        <div key={exercise.id} className='exercise'>
            <h5>
                <span>
                    {
                        Number(exercise.category) === Categories.Running &&
                        <FaRunning style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    }
                    {
                        Number(exercise.category) === Categories.Gym &&
                        <FaDumbbell style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    }
                    {
                        Number(exercise.category) === Categories.Walking &&
                        <FaWalking style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    }
                    {getDateAndTimeAsDateTimeString(exercise.date, exercise.time, i18n.language)}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(exercise.id); } }} />
            </h5>
            {error && <div className="error">{error}</div>}
            <p>
                {exercise.category > 0 ?
                    (<span> {
                        '#' + t('category_' + getExerciseCategoryNameByID(exercise.category))
                    }</span>) : ('')}
            </p>
            <p>
                <Link className='btn btn-primary' to={`/exercise/${exercise.id}`}>{t('view_details')}</Link>
            </p>
            <StarRating starCount={exercise.stars} />
        </div>
    )
}

export default Exercise