import GoBackButton from '../GoBackButton';
import RecipeButton from './RecipeButton';
import { useTranslation } from 'react-i18next';
import { ButtonGroup, Row } from 'react-bootstrap';
import { useState } from 'react'
import { db } from '../../firebase-config';
import { ref, push } from "firebase/database";
import { getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { useAuth } from '../../contexts/AuthContext';
import AddRecipe from './AddRecipe';

const ManageRecipes = () => {

  //states
  const [showAddRecipe, setShowAddRecipe] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { t } = useTranslation();

  const { currentUser } = useAuth();
  
  /** Add Recipe */
  const addRecipe = async (recipe) => {

    try{
      recipe["created"] = getCurrentDateAsJson();
      recipe["createdBy"] = currentUser.email;
      const dbref = ref(db, '/recipes');
      push(dbref, recipe);
      setMessage(t('recipe_save_successfull'));
    } catch(ex) {
      setError(t('recipe_save_exception'));
    }
  }

  return (
    <div>
      <h3 className="page-title">{t('manage_recipes_title')}</h3>
      <Row>
        <ButtonGroup>
          <GoBackButton  />          
          <RecipeButton 
                onShowAddRecipe={() => setShowAddRecipe(!showAddRecipe)}
                showAdd={showAddRecipe} 
          />
        </ButtonGroup>
       </Row>
       { error && <div className="error">{error}</div> }
       { message && <div className="success">{message}</div> }
       {showAddRecipe && <AddRecipe onAddRecipe={addRecipe} />}
    </div>
  )
}

export default ManageRecipes