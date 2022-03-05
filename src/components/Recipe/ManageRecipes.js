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

  const { t } = useTranslation();

  const { currentUser } = useAuth();
  
  /** Add Recipe */
  const addRecipe = async (recipe) => {
    recipe["created"] = getCurrentDateAsJson();
    recipe["createdBy"] = currentUser.email;
    const dbref = ref(db, '/recipes');
    push(dbref, recipe);
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
       {showAddRecipe && <AddRecipe onAddRecipe={addRecipe} />}
    </div>
  )
}

export default ManageRecipes