import GoBackButton from '../GoBackButton';
import RecipeButton from './RecipeButton';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { db } from '../../firebase-config';
import { ref, push, onValue, remove } from "firebase/database";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import AddRecipe from './AddRecipe';
import Recipes from './Recipes';

const ManageRecipes = () => {

  //states
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [showMessage, setShowMessage] = useState(false);
  const [recipes, setRecipes] = useState()

  const { t } = useTranslation();

  const { currentUser } = useAuth();

  //load data
  useEffect(() => {
    let cancel = false;

    const getRecipes = async () => {
      if(cancel) {
        return;
      }
      await fetchRecipesFromFirebase()
    }
    getRecipes()

    return () => { 
      cancel = true;
    }
  }, [])

  /** Fetch Recipes From Firebase */
  const fetchRecipesFromFirebase = async () => {
    const dbref = await ref(db, '/recipes');
    onValue(dbref, (snapshot) => {
      const snap = snapshot.val();
      const recipesFromDB = [];
      for(let id in snap) {
        recipesFromDB.push({id, ...snap[id]});
      }
      setRecipes(recipesFromDB);
    })
  }

  /** Add Recipe To Firebase */
  const addRecipe = async (recipe) => {

    try{
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const dbref = ref(db, '/recipes');
      push(dbref, recipe);
      setMessage(t('recipe_save_successfull'));
      setShowMessage(true);
    } catch(ex) {
      setError(t('recipe_save_exception'));
    }
  }

    /** Delete Recipe From Firebase */
    const deleteRecipe = async (id) => {
      const dbref = ref(db, `/recipes/${id}`);
      remove(dbref)
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
       { error && <div className="error">{error}</div> }
       { message && 
       <Alert show={showMessage} variant='success' className="success">
         {message}
         <div className='d-flex justify-content-end'>
          <button onClick={() => setShowMessage(false)} className='btn btn-success'>{t('button_close')}</button>
         </div>
       </Alert> }
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