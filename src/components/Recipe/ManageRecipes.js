import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { TRANSLATION, ICONS, NAVIGATION, COLORS, DB } from '../../utils/Constants';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { RecipeTypes } from '../../utils/Enums';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import { useToggle } from '../Hooks/useToggle';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { SortMode } from '../SearchSortFilter/SortModes';
import ManagePage from '../Site/ManagePage';

import AddRecipe from './AddRecipe';
import Recipes from './Recipes';

export default function ManageRecipes() {

  //translation
  const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //navigate
  const navigate = useNavigate();

  //fetch data
  const { data: recipes, setData: setRecipes,
    originalData: originalRecipes,
    counter, loading } = useFetch(DB.RECIPES);

  //modal
  const { status: showAddRecipe, toggleStatus: toggleAddRecipe } = useToggle();

  //alert
  const {
    message, setMessage,
    showMessage, setShowMessage,
    error, setError,
    showError, setShowError,
    clearMessages,
    showSuccess,
    showFailure
  } = useAlert();

  //user
  const { currentUser } = useAuth();

  const addRecipe = async (recipe) => {
    try {
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const key = await pushToFirebase(DB.RECIPES, recipe);
      navigate(`${NAVIGATION.RECIPE}/${key}`);
      showSuccess(t('recipe_save_successful'));
    } catch (ex) {
      showFailure(t('recipe_save_exception'));
      console.warn(ex);
    }
  }

  const deleteRecipe = async (id) => {
    removeFromFirebaseById(DB.RECIPES, id);
  }

  return (
    <ManagePage
      loading={loading}
      loadingText={tCommon("loading")}
      title={t('manage_recipes_title')}
      iconName={ICONS.UTENSILS}
      topActions={(
        <>
          <NavButton to={NAVIGATION.MANAGE_FOODITEMS}
            icon={ICONS.CARROT}>
            {t('button_manage_fooditems')}
          </NavButton>
          <NavButton to={NAVIGATION.MANAGE_RECIPELISTS}
            icon={ICONS.LIST_ALT}>
            {t('button_recipe_lists')}
          </NavButton>
        </>
      )}
      alert={{
        message,
        showMessage,
        error,
        showError,
        onClose: clearMessages,
      }}
      modal={{
        show: showAddRecipe,
        onHide: toggleAddRecipe,
        title: t('modal_header_add_recipe'),
        body: <AddRecipe onClose={toggleAddRecipe} onSave={addRecipe} />,
      }}
      searchSortFilter={{
        onSet: setRecipes,
        originalList: originalRecipes,
        //search
        showSearchByText: true,
        showSearchByDescription: true,
        showSearchByIncredients: true,
        //sort
        defaultSort: SortMode.Title_ASC,
        showSortByTitle: true,
        showSortByCreatedDate: true,
        showSortByStarRating: true,
        //filter
        filterMode: FilterMode.Title,
        showFilterCore: true,
        showFilterHaveRated: true,
      }}
      addButton={{
        show: showAddRecipe,
        iconName: ICONS.PLUS,
        openColor: COLORS.ADDBUTTON_OPEN,
        closedColor: COLORS.ADDBUTTON_CLOSED,
        openText: tCommon('buttons.button_close'),
        closedText: t('button_add_recipe'),
        onToggle: toggleAddRecipe,
      }}
      hasItems={recipes != null && recipes.length > 0}
      emptyText={t('no_recipes_to_show')}
    >
      <>
        <Recipes
          recipeType={RecipeTypes.Food}
          translation={TRANSLATION.TRANSLATION}
          translationKeyPrefix={TRANSLATION.RECIPE}
          recipes={recipes}
          originalList={originalRecipes}
          counter={counter}
          onDelete={deleteRecipe} />
      </>
    </ManagePage>
  )
}



