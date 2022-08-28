//recipe
import Recipe from './Recipe';
//proptypes
import PropTypes from 'prop-types';
//recipetypes
import { RecipeTypes } from '../../utils/Enums';

const Recipes = ({ recipeType, dbUrl, translation, recipes, onDelete }) => {

  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe
          recipeType={recipeType}
          dbUrl={dbUrl}
          translation={translation}
          key={recipe.id} recipe={recipe}
          onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Recipes

Recipes.defaultProps = {
  dbUrl: '/none',
  translation: '',
  recipeType: RecipeTypes.None
}

Recipes.propTypes = {
  dbUrl: PropTypes.string,
  translation: PropTypes.string,
  recipeType: RecipeTypes,
  onDelete: PropTypes.func
}