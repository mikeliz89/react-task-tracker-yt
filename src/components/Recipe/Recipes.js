import PropTypes from 'prop-types';

import { RecipeTypes } from '../../utils/Enums';
import Counter from '../Site/Counter';

import Recipe from './Recipe';

export default function Recipes({ recipeType, translation, translationKeyPrefix, recipes, onDelete, originalList, counter }) {

  return (
    <div>
      {
        originalList != null && counter != null ? (
          <Counter list={recipes} originalList={originalList} counter={counter} />
        ) : (<></>)
      }
      {recipes.map((recipe) => (
        <Recipe
          recipeType={recipeType}
          translation={translation}
          translationKeyPrefix={translationKeyPrefix}
          key={recipe.id} recipe={recipe}
          onDelete={onDelete} />
      ))}
    </div>
  )
}

Recipes.defaultProps = {
  translation: '',
  translationKeyPrefix: '',
  recipeType: RecipeTypes.None
}

Recipes.propTypes = {
  translation: PropTypes.string,
  translationKeyPrefix: PropTypes.string,
  recipeType: PropTypes.any,
  recipes: PropTypes.array,
  onDelete: PropTypes.func,
  originalList: PropTypes.array,
  counter: PropTypes.number
}


