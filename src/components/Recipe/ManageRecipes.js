import { useTranslation } from 'react-i18next';
import { ButtonGroup, Modal, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { TRANSLATION, ICONS, NAVIGATION, COLORS, DB } from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Alert from '../Alert';
import { RecipeTypes } from '../../utils/Enums';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import NavButton from '../Buttons/NavButton';
import { useAlert } from '../Hooks/useAlert';

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

  return loading ? (
    <h3>{tCommon("loading")}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={t('manage_recipes_title')} />

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <NavButton to={NAVIGATION.MANAGE_FOODITEMS}
            icon={ICONS.CARROT}>
            {t('button_manage_fooditems')}
          </NavButton>
          <NavButton to={NAVIGATION.MANAGE_RECIPELISTS}
            icon={ICONS.LIST_ALT}>
            {t('button_recipe_lists')}
          </NavButton>
        </ButtonGroup>
      </Row>

      <Alert
        message={message}
        showMessage={showMessage}
        error={error}
        showError={showError}
        onClose={clearMessages}
      />

      <Modal show={showAddRecipe} onHide={toggleAddRecipe}>
        <Modal.Header closeButton>
          <Modal.Title>{t('modal_header_add_recipe')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddRecipe onClose={toggleAddRecipe} onSave={addRecipe} />
        </Modal.Body>
      </Modal>

      {
        originalRecipes != null && originalRecipes.length > 0 ? (
          <SearchSortFilter
            onSet={setRecipes}
            originalList={originalRecipes}
            //search
            showSearchByText={true}
            showSearchByDescription={true}
            showSearchByIncredients={true}
            //sort
            defaultSort={SortMode.Title_ASC}
            showSortByTitle={true}
            showSortByCreatedDate={true}
            showSortByStarRating={true}
            //filter
            filterMode={FilterMode.Title}
            showFilterCore={true}
            showFilterHaveRated={true}
            showFilterNotHaveRated={true}
          />
        ) : (<></>)
      }

      <CenterWrapper>
        <Button
          iconName={ICONS.PLUS}
          color={showAddRecipe ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
          text={showAddRecipe ? tCommon('buttons.button_close') : t('button_add_recipe')}
          onClick={toggleAddRecipe} />
      </CenterWrapper>

      {
        recipes != null && recipes.length > 0 ? (
          <>
            <Counter list={recipes} originalList={originalRecipes} counter={counter} />
            <Recipes
              recipeType={RecipeTypes.Food}
              translation={TRANSLATION.TRANSLATION}
              translationKeyPrefix={TRANSLATION.RECIPE}
              recipes={recipes}
              onDelete={deleteRecipe} />
          </>
        ) : (
          <>
            <CenterWrapper>
              {t('no_recipes_to_show')}
            </CenterWrapper>
          </>
        )
      }
      {/* { <pre>{JSON.stringify(recipes)}</pre> } */}
    </PageContentWrapper>
  )
}
