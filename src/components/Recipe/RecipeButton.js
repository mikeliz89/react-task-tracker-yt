//react
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../Button'

export default function RecipeButton({ onShowAddRecipe, showAdd }) {

    const location = useLocation();
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    return (
        <>
            {location.pathname === '/managerecipes' && (
                <Button
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? t('button_close') : t('button_add_recipe')}
                    onClick={onShowAddRecipe} />
            )
            }
        </>
    )
}
