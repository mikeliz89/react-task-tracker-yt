import ManageGeneric from '../Common/ManageGeneric';
import { TRANSLATION, ICONS, DB, NAVIGATION } from '../../utils/Constants';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
import { RecipeTypes } from '../../utils/Enums';
import NavButton from '../Buttons/NavButton';
import { useTranslation } from 'react-i18next';

export default function ManageRecipes() {

  //translation
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });

  return (
    <ManageGeneric
      dbKey={DB.RECIPES}
      translationKey={TRANSLATION.RECIPE}
      AddComponent={AddRecipe}
      ListComponent={Recipes}
      iconName={ICONS.UTENSILS}
      title={t('manage_recipes_title')}
      ListComponentProps={{
        recipeType: RecipeTypes.Food,
        translation: TRANSLATION.TRANSLATION,
        translationKeyPrefix: TRANSLATION.RECIPE
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
          <NavButton to={NAVIGATION.MANAGE_FOODITEMS}
            icon={ICONS.CARROT}>
            {/** @ts-ignore */}
            {typeof t === 'function' ? t('button_manage_fooditems') : 'Hallinnoi raaka-aineita'}
          </NavButton>
          <NavButton to={NAVIGATION.MANAGE_RECIPELISTS}
            icon={ICONS.LIST_ALT}>
            {typeof t === 'function' ? t('button_recipe_lists') : 'Reseptilistat'}
          </NavButton>
        </>
      )}
    />
  );
}