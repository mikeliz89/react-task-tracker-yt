//recipe
import RecipeHistory from "./RecipeHistory";
//Firebase
import { db } from '../../firebase-config';
import { ref, remove } from "firebase/database";
//react
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
//icon
import Icon from "../Icon";
//proptypes
import PropTypes from 'prop-types';

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
        const dbref = ref(db, `${dbUrl}/${recipeID}/${recipeHistoryID}`);
        remove(dbref);
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