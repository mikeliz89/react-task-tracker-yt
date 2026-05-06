//translation
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import ManageGeneric from '../Common/ManageGeneric';
import AddDrinkingProduct from './AddDrinkingProduct';
import DrinkingProducts from './DrinkingProducts';

export default function ManageDrinkingProducts() {
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    return (
        <ManageGeneric
            dbKey={DB.DRINKINGPRODUCTS}
            translationKey={TRANSLATION.DRINKS}
            AddComponent={AddDrinkingProduct}
            ListComponent={DrinkingProducts}
            iconName={ICONS.WINE}
            title={t('manage_drinkingproducts_title')}
            searchSortFilterOptions={{
                showSearchByDescription: true,
                showSortByCreatedDate: true,
                showSortByName: true,
                showSortByStarRating: true,
                filterMode: FilterMode.Name,
                showFilterHaveAtHome: true,
                showFilterHaveRated: true,
                showSearchByText: true,
            }}
        />
    );
}


