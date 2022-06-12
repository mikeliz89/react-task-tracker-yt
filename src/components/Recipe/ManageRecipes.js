//react
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row, Alert, Form, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
//buttons
import GoBackButton from '../GoBackButton';
import Button from '../Button';
//recipe
import RecipeButton from './RecipeButton';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';
//firebase
import { db } from '../../firebase-config';
import { ref, push, onValue, remove } from "firebase/database";
//utils
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';

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
  const [sortingIsOn, setSortingIsOn] = useState(false);
  const [sortByTextAsc, setSortByTextAsc] = useState(true);
  //searching
  const [showOnlyCoreRecipes, setShowOnlyCoreRecipes] = useState(false);
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
      await fetchRecipesFromFirebase()
    }
    getRecipes();

    return () => {
      cancel = true;
    }
  }, [])

  /* kuuntele muutoksia, jos niitä tulee, filtteröi ja sorttaa */
  useEffect(() => {
    filterAndSort();
  }, [searchString, showOnlyCoreRecipes, sortByTextAsc]);

  /** Fetch Recipes From Firebase */
  const fetchRecipesFromFirebase = async () => {
    const dbref = await ref(db, '/recipes');
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const fromDB = [];
      for (let id in snap) {
        fromDB.push({ id, ...snap[id] });
      }
      setRecipes(fromDB);
      setOriginalRecipes(fromDB);
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

  const filterAndSort = () => {
    if (!originalRecipes) {
      return;
    }
    let newRecipes = originalRecipes;
    if (searchString !== "") {
      newRecipes = newRecipes.filter(recipe => recipe.title.toLowerCase().includes(searchString.toLowerCase()));
    }
    if (showOnlyCoreRecipes) {
      newRecipes = newRecipes.filter(recipe => recipe.isCore === true);
    }
    if (sortingIsOn) {
      newRecipes = [...newRecipes].sort((a, b) => {
        return a.title > b.title ? 1 : -1
      });
      if (sortByTextAsc) {
        newRecipes.reverse();
      }
    }
    setRecipes(newRecipes);
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
      <div className="page-content">
        {error && <div className="error">{error}</div>}
        {message &&
          <Alert show={showMessage} variant='success' className="success">
            {message}
            <div className='d-flex justify-content-end'>
              <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
            </div>
          </Alert>}
        {showAddRecipe && <AddRecipe onAddRecipe={addRecipe} />}
        <Form className='form-no-paddings'>
          <Form.Group as={Row}>
            <Form.Label column xs={3} sm={2}>{t('sorting')}</Form.Label>
            <Col xs={9} sm={10}>
              <Button onClick={() => {
                setSortByTextAsc(!sortByTextAsc);
                if (!sortingIsOn) {
                  setSortingIsOn(true);
                }
              }}
                text={t('name')} type="button" />
              {
                sortByTextAsc ? <FaArrowDown /> : <FaArrowUp />
              }
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