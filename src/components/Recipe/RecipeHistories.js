import RecipeHistory from "./RecipeHistory";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Icon from "../Icon";
import PropTypes from 'prop-types';
import { removeFromFirebaseByIdAndSubId } from "../../datatier/datatier";

function RecipeHistories({ dbUrl, translation, recipeHistories, recipeID }) {

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translation });

    //states
    const [counter, setCounter] = useState(0);

    //load data
    useEffect(() => {
        setCounter(recipeHistories.length);
    }, []);

    const deleteRecipeHistory = (recipeHistoryID) => {
        removeFromFirebaseByIdAndSubId(dbUrl, recipeID, recipeHistoryID);
    }

    return (
        <div>
            <h4>
                <Icon name='history' />
                {t('recipehistory_title')} {counter > 0 ? '(' + counter + ')' : ''}
            </h4>
            {recipeHistories.map((recipeHistory) => (
                <RecipeHistory
                    dbUrl={dbUrl}
                    translation={translation}
                    key={recipeHistory.id}
                    recipeHistory={recipeHistory}
                    onDelete={deleteRecipeHistory} />
            ))}
        </div>
    )
}

export default RecipeHistories

RecipeHistories.defaultProps = {
    dbUrl: '/none',
    translation: ''
}

RecipeHistories.propTypes = {
    dbUrl: PropTypes.string,
    translation: PropTypes.string,
    recipeID: PropTypes.string,
    recipeHistories: PropTypes.array
}