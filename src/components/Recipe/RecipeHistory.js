import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useTranslation } from 'react-i18next';
import Icon from "../Icon";

function RecipeHistory({ translation, recipeHistory, onDelete }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translation });

    return (
        <div>
            <p>
                {getJsonAsDateTimeString(recipeHistory.currentDateTime, i18n.language)}
                &nbsp;
                <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => {
                        if (window.confirm(t('delete_recipe_history_confirm_message'))) {
                            onDelete(recipeHistory.id);
                        }
                    }} />
            </p>
        </div>
    )
}

export default RecipeHistory