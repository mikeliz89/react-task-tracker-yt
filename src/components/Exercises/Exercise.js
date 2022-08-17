//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react'
//star rating
import StarRating from '../StarRating/StarRating';
//categories
import { Categories } from './Categories';
//utils
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
//icon
import Icon from '../Icon';

const Exercise = ({ exercise, onDelete }) => {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    //states 
    const [error] = useState('');

    const getIconNameByCategory = (exercise) => {
        switch (Number(exercise.category)) {
            case Categories.Running:
                return 'running';
            case Categories.Gym:
                return 'dumbbell';
            case Categories.Walking:
                return 'walking';
            case Categories.Aerobics:
                return 'child';
            case Categories.Bicycling:
                return 'biking';
            case Categories.Kayaking:
                return 'ship';
        }
    }

    return (
        <div key={exercise.id} className='exercise'>
            <h5>
                <span>
                    <Icon name={getIconNameByCategory(exercise)} />
                    {exercise.date + ' ' + exercise.time
                        // TODO: Korjaa formaatit kieleistyksien mukaan
                        //  getDateAndTimeAsDateTimeString(exercise.date, exercise.time, i18n.language)
                    }
                </span>
                <Icon className='deleteBtn' name='times' color='red' fontSize='1.2em' cursor='pointer'
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