import React from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'

const Recipe = ({recipe}) => {
    const { t } = useTranslation();
    return (
        <div>
            <h5>
            {recipe.title}
            </h5>
            <p>{recipe.description}</p>
            <p><Link to={`/recipe/${recipe.id}`}>{t('view_details')}</Link></p>
        </div>
    )
}

export default Recipe