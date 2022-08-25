//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//react
import { useTranslation } from 'react-i18next';
//icon
import Icon from "../Icon";

//Suora kopio DrinkHistory:stä. Todo: Yhdistä komponentiksi?
function RecipeHistory({ recipeHistory, onDelete }) {

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    return (
        <div>
            <span>
                {getJsonAsDateTimeString(recipeHistory.currentDateTime, i18n.language)}
                &nbsp;
                <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_recipe_history_confirm_message'))) { onDelete(recipeHistory.id); } }} />
            </span>
        </div>
    )
}

export default RecipeHistory