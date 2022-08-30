//react
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
//StarRating
import StarRating from '../StarRating/StarRating';
//exercises
import { getIconNameByCategory } from './Categories';
//icon
import Icon from '../Icon';
//utils
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';

const Exercise = ({ exercise, onDelete }) => {

    //translation
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

    return (
        <div className='exercise'>
            <h5>
                <span>
                    <Icon name={getIconNameByCategory(exercise.category)} />
                    {exercise.date + ' ' + exercise.time
                        // TODO: Korjaa formaatit kieleistyksien mukaan
                        //  getDateAndTimeAsDateTimeString(exercise.date, exercise.time, i18n.language)
                    }
                </span>
                <Icon className='deleteBtn' name='times' color='red' fontSize='1.2em' cursor='pointer'
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(exercise.id); } }} />
            </h5>
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