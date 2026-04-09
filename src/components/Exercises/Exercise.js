import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import DeleteButton from '../Buttons/DeleteButton';
import Icon from '../Icon';
import StarRating from '../StarRating/StarRating';

import { getIconNameByCategory } from './Categories';

export default function Exercise({ exercise, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    return (
        <div className='listContainer'>
            <h5>
                <span>
                    <Icon name={getIconNameByCategory(exercise.category)} />
                    {exercise.date + ' ' + exercise.time
                        // TODO: Korjaa formaatit kieleistyksien mukaan
                        //  getDateAndTimeAsDateTimeString(exercise.date, exercise.time, i18n.language)
                    }
                </span>
                <DeleteButton
                    onDelete={onDelete}
                    id={exercise.id}
                />
            </h5>
            <p>
                {exercise.category > 0 ?
                    (<span> {
                        '#' + t('category_' + getExerciseCategoryNameByID(exercise.category))
                    }</span>) : ('')}
            </p>
            <p>
                {exercise.description}
            </p>
            <p>
                <Link className='btn btn-primary' to={`${NAVIGATION.EXERCISE}/${exercise.id}`}>{t('view_details')}</Link>
            </p>
            <StarRating starCount={exercise.stars} />
        </div>
    )
}


