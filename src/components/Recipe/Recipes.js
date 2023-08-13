import Recipe from './Recipe';
import PropTypes from 'prop-types';
import { RecipeTypes } from '../../utils/Enums';

export default function Recipes({ recipeType, translation, recipes, onDelete }) {

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