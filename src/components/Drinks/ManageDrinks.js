
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, NAVIGATION } from '../../utils/Constants';
import { RecipeTypes } from '../../utils/Enums';
import NavButton from '../Buttons/NavButton';
import ListMapper from '../Common/ListMapper';
import Recipe from '../Recipe/Recipe';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManageGeneric from '../Common/ManageGeneric';
import AddDrink from './AddDrink';


export default function ManageDrinks() {

    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });

    return (
        <ManageGeneric
            dbKey={DB.DRINKS}
            translationKey={TRANSLATION.DRINKS}
            AddComponent={AddDrink}
            ListComponent={ListMapper}
            iconName={ICONS.COCKTAIL}
            title={t('manage_drinks_title')}
            ListComponentProps={{
                ItemComponent: Recipe,
                translation: TRANSLATION.TRANSLATION,
                translationKeyPrefix: TRANSLATION.DRINKS,
                recipeType: RecipeTypes.Drink
            }}
            AddComponentProps={{
                autoFocusTitle: true
            }}
            searchSortFilterOptions={{
                showSearchByText: true,
                showSearchByDescription: true,
                showSearchByIncredients: true,
                defaultSort: SortMode.Title_ASC,
                showSortByTitle: true,
                showSortByCreatedDate: true,
                showSortByStarRating: true,
                filterMode: FilterMode.Title,
                showFilterCore: true,
                showFilterHaveRated: true,
            }}
            topActions={(
                <>
                    <NavButton to={NAVIGATION.MANAGE_DRINKINPRODUCTS} icon={ICONS.WINE}>
                        {t('button_manage_drinkingproducts')}
                    </NavButton>
                    <NavButton to={NAVIGATION.MANAGE_DRINKLISTS} icon={ICONS.LIST_ALT}>
                        {t('button_drinklists')}
                    </NavButton>
                </>
            )}
            copyButton={{ showCopyButton: true }}
        />
    );
}



