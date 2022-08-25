//recipe
import RecipeHistory from "./RecipeHistory";
//Firebase
import { db } from '../../firebase-config';
import { ref, remove } from "firebase/database";
//react
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import Icon from "../Icon";

//Suora kopio DrinkHistoriesista. Todo: Yhdistä komponentiksi?
function RecipeHistories({ recipeHistories, recipeID }) {

    //constants
    const DB_RECIPE_HISTORY = '/recipehistory';

    //translation
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states
    const [counter, setCounter] = useState(0);

    //load data
    useEffect(() => {
        setCounter(recipeHistories.length);
    }, []);

    const deleteRecipeHistory = (recipeHistoryID) => {
        const dbref = ref(db, `${DB_RECIPE_HISTORY}/${recipeID}/${recipeHistoryID}`);
        remove(dbref);
    }

    return (
        <div>
            <h4>
                <Icon name='history' />
                {t('recipehistory_title')} {counter > 0 ? '(' + counter + ')' : ''}
            </h4>
            {recipeHistories.map((recipeHistory) => (
                <RecipeHistory key={recipeHistory.id} recipeHistory={recipeHistory} onDelete={deleteRecipeHistory} />
            ))}
        </div>
    )
}

export default RecipeHistories
