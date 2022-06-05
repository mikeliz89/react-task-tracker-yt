import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import StarRating from '../StarRating'
import { FaTimes, FaUtensils } from 'react-icons/fa'

const Recipe = ({ recipe, onDelete }) => {

    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    return (
        <div className={recipe.isCore === true ? 'recipe coreRecipe' : 'recipe'}>
            <h5>
                <span>
                    <FaUtensils style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {recipe.title}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer' }}
                    onClick={() => { if (window.confirm(t('delete_recipe_confirm_message'))) { onDelete(recipe.id); } }} />
            </h5>
            {recipe.category !== "" ? (<p> {'#' + recipe.category}</p>) : ('')}
            <p>{recipe.description}</p>
            <p><Link to={`/recipe/${recipe.id}`}>{t('view_details')}</Link></p>
            <StarRating starCount={recipe.stars} />
        </div>
    )
}

export default Recipe