import Recipe from './Recipe'

const Recipes = ({ recipes, onDelete }) => {

  return (
    <div>
      {recipes.map((recipe) => (
        <Recipe key={recipe.id} recipe={recipe} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default Recipes
