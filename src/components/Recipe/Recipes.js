//recipe
import Recipe from './Recipe';
//proptypes
import PropTypes from 'prop-types';
//recipetypes
import { RecipeTypes } from '../../utils/Enums';

const Recipes = ({ recipeType, translation, recipes, onDelete }) => {

  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe
          recipeType={recipeType}
          translation={translation}
          key={recipe.id} recipe={recipe}
          onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Recipes

Recipes.defaultProps = {
  translation: '',
  recipeType: RecipeTypes.None
}

Recipes.propTypes = {
  translation: PropTypes.string,
  recipeType: PropTypes.any,
  recipes: PropTypes.array,
  onDelete: PropTypes.func
}