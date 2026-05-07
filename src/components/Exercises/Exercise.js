import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, COLORS, DB } from '../../utils/Constants';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';
import { getJsonAsDateString } from '../../utils/DateTimeUtils';
import { getIconNameByCategory } from './Categories';

export default function Exercise({ exercise, onDelete }) {

    //translation
    const { t, i18n } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    let exerciseTitle = '';
    const formattedDate = exercise.date ? getJsonAsDateString(exercise.date, i18n.language) : '';
    if (formattedDate && exercise.time) {
        exerciseTitle = `${formattedDate} ${exercise.time}`;
    } else if (formattedDate) {
        exerciseTitle = formattedDate;
    } else if (exercise.time) {
        exerciseTitle = exercise.time;
    }

    return (
        <ListRow
            item={exercise}
            dbKey={DB.EXERCISES}
            headerProps={{
                title: exerciseTitle,
                titleTo: `${NAVIGATION.EXERCISE}/${exercise.id}`,
                titleIcon: getIconNameByCategory(exercise.category),
                titleIconColor: COLORS.GRAY,
            }}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={exercise.id}
            section={
                <>
                    <p>
                        {exercise.category > 0 ?
                            (<span> {'#' + t('category_' + getExerciseCategoryNameByID(exercise.category))}
                            </span>) : ('')}
                    </p>
                    <p>
                        {exercise.description}
                    </p>
                </>
            }
        />
    )
}



