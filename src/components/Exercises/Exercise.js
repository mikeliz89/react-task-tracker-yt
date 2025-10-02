import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { getIconNameByCategory } from './Categories';
import Icon from '../Icon';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';

export default function Exercise({ exercise, onDelete }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_EXERCISES });

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
                <Icon className={Constants.CLASSNAME_DELETEBTN} name={Constants.ICON_DELETE}
                    color={Constants.COLOR_DELETEBUTTON} fontSize='1.2em' cursor='pointer'
                    onClick={() => { if (window.confirm(t('delete_exercise_confirm_message'))) { onDelete(exercise.id); } }} />
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
                <Link className='btn btn-primary' to={`${Constants.NAVIGATION_EXERCISE}/${exercise.id}`}>{t('view_details')}</Link>
            </p>
            <StarRating starCount={exercise.stars} />
        </div>
    )
}