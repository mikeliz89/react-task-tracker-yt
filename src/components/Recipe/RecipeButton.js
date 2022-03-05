import React from 'react'
import { useLocation } from 'react-router-dom'
import Button from '../Button'
import { useTranslation } from 'react-i18next';

export default function RecipeButton({onShowAddRecipe, showAdd}) {

    const location = useLocation();
    const { t } = useTranslation();

    return (
        <>
            { location.pathname === '/managerecipes' && (
                <Button 
                    color={showAdd ? 'red' : 'green'}
                    text={showAdd ? t('button_close') : t('button_add_recipe')} 
                    onClick={onShowAddRecipe} />
                )
            }
        </>
    )
}
