import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import ManageGeneric from '../Common/ManageGeneric';
import AddFoodItem from './AddFoodItem';
import ListMapper from '../Common/ListMapper';
import FoodItem from './FoodItem';

export default function ManageFoodItems() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    return (
        <ManageGeneric
            dbKey={DB.FOODITEMS}
            translationKey={TRANSLATION.RECIPE}
            AddComponent={AddFoodItem}
            ListComponent={ListMapper}
            ListComponentProps={{ ItemComponent: FoodItem }}
            iconName={ICONS.CARROT}
            title={t('manage_fooditems_title')}
            searchSortFilterOptions={{
                showSearchByText: true,
                showSortByName: true,
                showSortByCreatedDate: true,
                filterMode: FilterMode.Name,
                showFilterHaveAtHome: true,
            }}
            copyButton={{ showCopyButton: true }}
        />
    );
}


