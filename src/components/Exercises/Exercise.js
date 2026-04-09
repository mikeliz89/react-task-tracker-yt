import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import NavButton from '../Buttons/NavButton';
import ListRow from '../Site/ListRow';

import { getIconNameByCategory } from './Categories';

export default function Exercise({ exercise, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    return (
        <ListRow
            headerLeft={
                <span>
                    <NavButton
                        to={`${NAVIGATION.EXERCISE}/${exercise.id}`}
                        className=""
                        icon={getIconNameByCategory(exercise.category)}
                    >
                        {exercise.date + ' ' + exercise.time
                            // TODO: Korjaa formaatit kieleistyksien mukaan
                            //  getDateAndTimeAsDateTimeString(exercise.date, exercise.time, i18n.language)
                        }
                    </NavButton>
                </span>
            }
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={exercise.id}
            starCount={exercise.stars}
        >
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
            </p>
        </ListRow>
    )
}



