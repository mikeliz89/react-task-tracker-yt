import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
import { db } from '../../firebase-config';
import { ref, onValue } from 'firebase/database';
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

const ManageRecipes = () => {

  //states
  const [loading, setLoading] = useState(true);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [recipes, setRecipes] = useState();
  const [originalRecipes, setOriginalRecipes] = useState();
  const [counter, setCounter] = useState(0);

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

  //load data
  useEffect(() => {
    let cancel = false;

    const getRecipes = async () => {
      if (cancel) {
        return;
      }
      await fetchRecipesFromFirebase();
    }
    getRecipes();

    return () => {
      cancel = true;
    }
  }, [])

  const fetchRecipesFromFirebase = async () => {
    const dbref = await ref(db, Constants.DB_RECIPES);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      let counterTemp = 0;
      for (let id in snap) {
        counterTemp++;
        fromDB.push({ id, ...snap[id] });
      }
      setCounter(counterTemp);
      setLoading(false);
      setRecipes(fromDB);
      setOriginalRecipes(fromDB);
    })
  }

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
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <Button
            color={showAddRecipe ? 'red' : 'green'}
            text={showAddRecipe ? t('button_close') : t('button_add_recipe')}
            onClick={() => setShowAddRecipe(!showAddRecipe)} />
        </ButtonGroup>
      </Row>
      <PageTitle title={t('manage_recipes_title')} />


      <div>
        <Link to={Constants.NAVIGATION_MANAGE_FOODITEMS} className='btn btn-primary'>{t('button_manage_fooditems')}</Link>
        &nbsp;
        <Link to={Constants.NAVIGATION_MANAGE_RECIPELISTS} className='btn btn-primary'>
          <Icon name={Constants.ICON_LIST_ALT} color='white' />
          {t('button_recipe_lists')}
        </Link>
      </div>

      <Alert message={message} showMessage={showMessage}
        error={error} showError={showError}
        variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

      {
        showAddRecipe && <AddRecipe onClose={() => setShowAddRecipe(false)} onSave={addRecipe} />
      }

      {
        originalRecipes != null && originalRecipes.length > 0 ? (
          <SearchSortFilter
            onSet={setRecipes}
            originalList={originalRecipes}
            //search
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

export default ManageRecipes