//react
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row, Alert, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

const ManageRecipes = () => {

  //constants
  const DB_RECIPES = '/recipes';

  //states
  const [loading, setLoading] = useState(true);
  const [showAddRecipe, setShowAddRecipe] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [recipes, setRecipes] = useState();
  const [originalRecipes, setOriginalRecipes] = useState();

  //translation
  const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

  //user
  const { currentUser } = useAuth();

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

  /** Fetch Recipes From Firebase */
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

  /** Add Recipe To Firebase */
  const addRecipe = async (recipe) => {
    try {
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const dbref = ref(db, DB_RECIPES);
      push(dbref, recipe);
      setMessage(t('recipe_save_successfull'));
      setShowMessage(true);
    } catch (ex) {
      setError(t('recipe_save_exception'));
    }
  }

  /** Delete Recipe From Firebase */
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
        {error && <div className="error">{error}</div>}
        {message &&
          <Alert show={showMessage} variant='success'>
            {message}
            <div className='d-flex justify-content-end'>
              <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
            </div>
          </Alert>
        }
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
            <Recipes recipes={recipes}
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