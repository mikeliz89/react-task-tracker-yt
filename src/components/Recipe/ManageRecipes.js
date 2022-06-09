import GoBackButton from '../GoBackButton';
import RecipeButton from './RecipeButton';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row, Alert, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, push, onValue, remove } from "firebase/database";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
import Button from '../Button';

const ManageRecipes = () => {

  //states
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false);
  const [recipes, setRecipes] = useState()
  const [originalRecipes, setOriginalRecipes] = useState();
  const [searchString, setSearchString] = useState('');
  //sorting
  const [sortByTextAsc, setSortByTextAsc] = useState(true)
  //searching
  const [showOnlyCoreRecipes, setShowOnlyCoreRecipes] = useState(false);

  const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

  const { currentUser } = useAuth();

  //load data
  useEffect(() => {
    let cancel = false;

    const getRecipes = async () => {
      if (cancel) {
        return;
      }
      await fetchRecipesFromFirebase()
    }
    getRecipes()

    return () => {
      cancel = true;
    }
  }, [])

  /* kuuntele searchStringin muutoksia, jos niitä tulee, filtteröi */
  useEffect(() => {
    filterRecipesByTitle();
  }, [searchString]);

  useEffect(() => {
    filterRecipesByShowCoreRecipesOnly();
  }, [showOnlyCoreRecipes]);

  /** Fetch Recipes From Firebase */
  const fetchRecipesFromFirebase = async () => {
    const dbref = await ref(db, '/recipes');
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const recipesFromDB = [];
      for (let id in snap) {
        recipesFromDB.push({ id, ...snap[id] });
      }
      setRecipes(recipesFromDB);
      setOriginalRecipes(recipesFromDB);
    })
  }

  /** Add Recipe To Firebase */
  const addRecipe = async (recipe) => {
    try {
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const dbref = ref(db, '/recipes');
      push(dbref, recipe);
      setMessage(t('recipe_save_successfull'));
      setShowMessage(true);
    } catch (ex) {
      setError(t('recipe_save_exception'));
    }
  }

  /** Delete Recipe From Firebase */
  const deleteRecipe = async (id) => {
    const dbref = ref(db, `/recipes/${id}`);
    remove(dbref)
  }

  const toggleSortText = (recipes) => {

    let sortedRecipes = recipes.sort((a, b) => a.title.localeCompare(b.title));

    if (sortByTextAsc) {
      sortedRecipes = sortedRecipes.reverse();
    }

    setRecipes(sortedRecipes);

    //Toggle sorting
    const sortByText = !sortByTextAsc;
    setSortByTextAsc(sortByText);
  }

  const filterRecipesByTitle = () => {
    if (searchString === "") {
      setRecipes(originalRecipes);
      return;
    }
    let filtered = originalRecipes.filter(recipe => recipe.title.toLowerCase().includes(searchString.toLowerCase()));
    setRecipes(filtered);
  }

  const filterRecipesByShowCoreRecipesOnly = () => {
    if (!showOnlyCoreRecipes) {
      setRecipes(originalRecipes);
      return;
    }
    let filtered = originalRecipes.filter(recipe => recipe.isCore === true);
    setRecipes(filtered);
  }

  return (
    <div>
      <Row>
        <ButtonGroup>
          <GoBackButton />
          <RecipeButton
            onShowAddRecipe={() => setShowAddRecipe(!showAddRecipe)}
            showAdd={showAddRecipe}
          />
        </ButtonGroup>
      </Row>
      <h3 className="page-title">{t('manage_recipes_title')}</h3>
      <Form className='form-no-paddings'>
        <Form.Group as={Row}>
          <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
          <Col xs={9} sm={10}>
            <Button onClick={() => toggleSortText(recipes)} text={t('name')} type="button" />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column xs={3} sm={2}>{t('search')}</Form.Label>
          <Col xs={9} sm={10}>
            <Form.Control
              type="text"
              id="inputSearchString"
              aria-describedby="searchHelpBlock"
              onChange={(e) => setSearchString(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="formHorizontalCheck">
          <Form.Label column xs={3} sm={2}>{t('show')}</Form.Label>
          <Col xs={9} sm={10}>
            <Form.Check label={t('core_only')} onChange={(e) => setShowOnlyCoreRecipes(e.currentTarget.checked)} />
          </Col>
        </Form.Group>
      </Form>
      {error && <div className="error">{error}</div>}
      {message &&
        <Alert show={showMessage} variant='success' className="success">
          {message}
          <div className='d-flex justify-content-end'>
            <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
          </div>
        </Alert>}
      {showAddRecipe && <AddRecipe onAddRecipe={addRecipe} />}
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
  )
}

export default ManageRecipes