import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION } from '../../utils/Constants';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';

import { getIconNameByCategory } from './Categories';

export default function Exercise({ exercise, onDelete }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const exerciseTitle = `${exercise.date} ${exercise.time}`;

    return (
        <ListRow
            headerTitle={exerciseTitle}
            headerTitleTo={`${NAVIGATION.EXERCISE}/${exercise.id}`}
            headerTitleIcon={getIconNameByCategory(exercise.category)}
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



