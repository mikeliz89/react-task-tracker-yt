import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS } from '../../utils/Constants';
import ManageGeneric from '../Common/ManageGeneric';
import AddMovement from './AddMovement';
import Movements from './Movements';

export default function ManageMovements() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    return (
        <ManageGeneric
            dbKey={DB.EXERCISE_MOVEMENTS}
            translationKey={TRANSLATION.EXERCISES}
            AddComponent={AddMovement}
            ListComponent={Movements}
            iconName={ICONS.EXERCISE}
            title={t('manage_movements_title')}
            AddComponentModalTitle={t('modal_header_add_movement')}
            searchSortFilterOptions={{
                showSearchByText: true,
                showSortByCreatedDate: true,
                showSortByStarRating: true,
                showSortByName: true,
                filterMode: 'Name',
                showFilterHaveRated: true,
            }}
        />
    );
}


