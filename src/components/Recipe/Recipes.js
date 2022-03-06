import React from 'react'
import Recipe from './Recipe'

const Recipes = ({recipes}) => {

    return (
        <div style={{marginTop:'20px'}}>
          {recipes.map((recipe) => (
            <Recipe key={recipe.id} recipe={recipe} />
          ))}  
        </div>
    )
}

export default Recipes
