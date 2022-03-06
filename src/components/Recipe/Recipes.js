import React from 'react'
import Recipe from './Recipe'

const Recipes = ({recipes}) => {

    return (
        <div className="page-content">
          {recipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}  
        </div>
    )
}

export default Recipes
