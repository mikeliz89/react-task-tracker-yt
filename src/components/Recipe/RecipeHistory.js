import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { useTranslation } from 'react-i18next';
import Icon from "../Icon";
import * as Constants from '../../utils/Constants';
import DeleteButton from '../Buttons/DeleteButton';

export default function RecipeHistory({ translation, translationKeyPrefix, recipeHistory, onDelete }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON_CONFIRM });

    return (
        <div>
            <p>
                {getJsonAsDateTimeString(recipeHistory.currentDateTime, i18n.language)}
                &nbsp;
                <DeleteButton
                    confirmMessage={tCommon('areyousure')}
                    onDelete={onDelete}
                    id={recipeHistory.id}
                />
            </p>
        </div>
    )
}