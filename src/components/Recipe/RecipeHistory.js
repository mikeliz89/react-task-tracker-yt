import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import DeleteButton from '../Buttons/DeleteButton';

export default function RecipeHistory({ translation, translationKeyPrefix, recipeHistory, onDelete }) {

    return (
        <div>
            <p>
                {getJsonAsDateTimeString(recipeHistory.currentDateTime, i18n.language)}
                &nbsp;
                <DeleteButton
                    onDelete={onDelete}
                    id={recipeHistory.id}
                />
            </p>
        </div>
    )
}