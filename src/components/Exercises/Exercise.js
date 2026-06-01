import { useTranslation } from 'react-i18next';

import { TRANSLATION, NAVIGATION, COLORS, DB } from '../../utils/Constants';
import { getExerciseCategoryNameByID } from '../../utils/ListUtils';
import ListRow from '../Site/ListRow';
import { getJsonAsDateString } from '../../utils/DateTimeUtils';
import { getIconNameByCategory } from './Categories';

export default function Exercise({ item, onDelete }) {

    //translation
    const { t, i18n } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });

    let exerciseTitle = '';
    const formattedDate = item.date ? getJsonAsDateString(item.date, i18n.language) : '';
    if (formattedDate && item.time) {
        exerciseTitle = `${formattedDate} ${item.time}`;
    } else if (formattedDate) {
        exerciseTitle = formattedDate;
    } else if (item.time) {
        exerciseTitle = item.time;
    }

    return (
        <ListRow
            item={item}
            dbKey={DB.EXERCISES}
            headerProps={{
                title: exerciseTitle,
                titleTo: `${NAVIGATION.EXERCISE}/${item.id}`,
                titleIcon: getIconNameByCategory(item.category),
                titleIconColor: COLORS.GRAY,
            }}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={item.id}
            section={
                <>
                    <p>
                        {item.category > 0 ?
                            (<span> {'#' + t('category_' + getExerciseCategoryNameByID(item.category))}
                            </span>) : ('')}
                    </p>
                    <p>
                        {item.description}
                    </p>
                </>
            }
        />
    )
}



