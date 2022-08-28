//react
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//recipe
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
//firebase
import { db } from '../../firebase-config';
import { ref, push, onValue, remove } from "firebase/database";
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//title
import PageTitle from '../PageTitle';
//search sort filter
import SearchSortFilter from '../SearchSortFilter/SearchSortFilter';
//alert
import Alert from '../Alert';
//import recipetypes
import { RecipeTypes } from '../../utils/Enums';

const ManageRecipes = () => {

  //constants
  const DB_RECIPES = '/recipes';
  const NAVIGATION_RECIPE = '/recipe';
  const TRANSLATION = 'recipe';

  //states
  const [loading, setLoading] = useState(true);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [recipes, setRecipes] = useState();
  const [originalRecipes, setOriginalRecipes] = useState();

  //alert
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState('');

  //translation
  const { t } = useTranslation(TRANSLATION, { keyPrefix: TRANSLATION });

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
    const dbref = await ref(db, DB_RECIPES);
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      for (let id in snap) {
        fromDB.push({ id, ...snap[id] });
      }
      setLoading(false);
      setRecipes(fromDB);
      setOriginalRecipes(fromDB);
    })
  }

  const addRecipe = async (recipe) => {
    try {
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const dbref = ref(db, DB_RECIPES);
      push(dbref, recipe).then((snap) => {
        const key = snap.key;
        navigate(`${NAVIGATION_RECIPE}/${key}`);
      })
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
    const dbref = ref(db, `${DB_RECIPES}/${id}`);
    remove(dbref)
  }

  return loading ? (
    <h3>{t('loading')}</h3>
  ) : (
    <div>
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
      <div className="page-content">
        <Link to="/managefooditems" className='btn btn-primary'>{t('manage_fooditems_button')}</Link>

        <Alert message={message} showMessage={showMessage}
          error={error} showError={showError}
          variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

        {showAddRecipe && <AddRecipe onClose={() => setShowAddRecipe(false)} onAddRecipe={addRecipe} />}
        <SearchSortFilter
          useTitleFiltering={true}
          onSet={setRecipes}
          showFilterCore={true}
          showSortByTitle={true}
          showSortByCreatedDate={true}
          showSortByStarRating={true}
          showSearchByDescription={true}
          originalList={originalRecipes} />
        {
          recipes != null && recipes.length > 0 ? (
            <Recipes
              recipeType={RecipeTypes.Food}
              translation={TRANSLATION}
              recipes={recipes}
              onDelete={deleteRecipe} />
          ) : (
            t('no_recipes_to_show')
          )
        }
        {/* { <pre>{JSON.stringify(recipes)}</pre> } */}
      </div>
    </div>
  )
}

export default ManageRecipes