import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import StarRating from '../StarRating';

const Recipe = ({recipe}) => {
    const { t } = useTranslation();
    return (
        <div className='recipe'>
            <h5>
            {recipe.title}
            </h5>
             {recipe.category != "" ? (<p> {'#' + recipe.category}</p>): ('') }
            <p>{recipe.description}</p>
            <p><Link to={`/recipe/${recipe.id}`}>{t('view_details')}</Link></p>
            <StarRating starCount={recipe.stars} />
        </div>
    )
}

export default Recipe