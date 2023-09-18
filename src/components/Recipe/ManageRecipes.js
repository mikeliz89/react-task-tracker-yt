import { useTranslation } from 'react-i18next';
import { ButtonGroup, Modal, Row } from 'react-bootstrap';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
import Alert from '../Alert';
import { RecipeTypes } from '../../utils/Enums';
import Icon from '../Icon';
import PageContentWrapper from '../Site/PageContentWrapper';
import Counter from '../Site/Counter';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, removeFromFirebaseById } from '../../datatier/datatier';
import { SortMode } from '../SearchSortFilter/SortModes';
import { FilterMode } from '../SearchSortFilter/FilterModes';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';

export default function ManageRecipes() {

  //fetch data
  const { data: recipes, setData: setRecipes,
    originalData: originalRecipes, counter, loading } = useFetch(Constants.DB_RECIPES);

  //modal
  const { status: showAddRecipe, toggleStatus: toggleAddRecipe } = useToggle();

  //alert
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  //translation
  const { t } = useTranslation(Constants.TRANSLATION_RECIPE, { keyPrefix: Constants.TRANSLATION_RECIPE });

  //user
  const { currentUser } = useAuth();

  //navigate
  const navigate = useNavigate();

  const addRecipe = async (recipe) => {
    try {
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const key = await pushToFirebase(Constants.DB_RECIPES, recipe);
      navigate(`${Constants.NAVIGATION_RECIPE}/${key}`);
      showSuccess();
    } catch (ex) {
      showFailure();
    }
  }

  function showSuccess() {
    setMessage(t('recipe_save_successful'));
    setShowMessage(true);
  }

  function showFailure() {
    setError(t('recipe_save_exception'));
    setShowError(true);
  }

  const deleteRecipe = async (id) => {
    removeFromFirebaseById(Constants.DB_RECIPES, id);
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <PageContentWrapper>

      <PageTitle title={t('manage_recipes_title')} />

      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Link to={Constants.NAVIGATION_MANAGE_FOODITEMS} className='btn btn-primary'>{t('button_manage_fooditems')}</Link>
          <Link to={Constants.NAVIGATION_MANAGE_RECIPELISTS} className='btn btn-primary'>
            <Icon name={Constants.ICON_LIST_ALT} color={Constants.COLOR_WHITE} />
            {t('button_recipe_lists')}
          </Link>
        </ButtonGroup>
      </Row>

      <Alert message={message} showMessage={showMessage}
        error={error} showError={showError}
        variant={Constants.VARIANT_SUCCESS}
        onClose={() => { setShowMessage(false); setShowError(false); }}
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
          iconName={Constants.ICON_PLUS}
          color={showAddRecipe ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
          text={showAddRecipe ? t('button_close') : t('button_add_recipe')}
          onClick={toggleAddRecipe} />
      </CenterWrapper>

      {
        recipes != null && recipes.length > 0 ? (
          <>
            <Counter list={recipes} originalList={originalRecipes} counter={counter} />
            <Recipes
              recipeType={RecipeTypes.Food}
              translation={Constants.TRANSLATION_RECIPE}
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
