import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useTranslation } from 'react-i18next';
import Icon from "../Icon";
import * as Constants from '../../utils/Constants';

export default function RecipeHistory({ translation, recipeHistory, onDelete }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translation });

    return (
        <div>
            <p>
                {getJsonAsDateTimeString(recipeHistory.currentDateTime, i18n.language)}
                &nbsp;
                <Icon name={Constants.ICON_DELETE}
                    className={Constants.CLASSNAME_DELETEBTN}
                    style={{ color: Constants.COLOR_DELETEBUTTON, cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => {
                        if (window.confirm(t('delete_recipe_history_confirm_message'))) {
                            onDelete(recipeHistory.id);
                        }
                    }} />
            </p>
        </div>
    )
}