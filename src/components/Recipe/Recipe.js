import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import StarRating from '../StarRating'
import { FaTimes, FaUtensils} from 'react-icons/fa'

const Recipe = ({recipe, onDelete}) => {
    const { t } = useTranslation();
    return (
        <div className='recipe'>
            <h5>
                <span>
                <FaUtensils style={{color:'gray', cursor: 'pointer', marginRight:'5px', marginBottom: '3x' }} />
                {recipe.title}
                </span>
                <FaTimes className="deleteRecipekBtn" style={{color:'red', cursor: 'pointer'}} 
                onClick={() => {if(window.confirm(t('delete_recipe_confirm_message'))) {onDelete(recipe.id);}}} />
            </h5>
             {recipe.category != "" ? (<p> {'#' + recipe.category}</p>): ('') }
            <p>{recipe.description}</p>
            <p><Link to={`/recipe/${recipe.id}`}>{t('view_details')}</Link></p>
            <StarRating starCount={recipe.stars} />
        </div>
    )
}

export default Recipe