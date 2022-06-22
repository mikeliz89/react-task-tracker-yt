//react
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes, FaUtensils, FaShoppingCart } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useState } from 'react'
//star rating
import StarRating from '../StarRating/StarRating';
//firebase
import { db } from '../../firebase-config';
import { ref, push, child, onValue } from "firebase/database";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getRecipeCategoryNameByID } from '../../utils/ListUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//i18n
import i18n from "i18next";

const Recipe = ({ recipe, onDelete }) => {

    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

    //states 
    const [error, setError] = useState('')

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {t('shopcart_tooltip')}
        </Tooltip>
    );

    const makeShoppingList = async () => {
        const incredients = await fetchIncredientsFromFirebase(recipe.id);
        //const incredients = await getRecipeIncredientsTest();

        if (incredients && incredients.length > 0) {
            let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
            addTaskList({ title: `${t('shoppinglist')} ${currentDateTime}` }, incredients).then(() => {
                navigate('/managetasklists')
            });
        } else if (incredients && incredients.length <= 0) {
            setError("Ei yhtään ainesosaa. Ostoslistaa ei voitu luoda");
        }
    }

    /*
    const getRecipeIncredientsTest = async () => {
        return new Promise((resolve, reject) => {
            //Faking an API Call
            setTimeout(() => resolve(false), 400)
        })
    }
    */

    const fetchIncredientsFromFirebase = async (recipeID) => {
        const incredients = [];
        const dbref = await child(ref(db, '/incredients'), recipeID);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            for (let id in snap) {
                incredients.push({ id, ...snap[id] });
            }
        });
        return incredients;
    }

    const addTaskList = async (taskList, incredients) => {
        taskList["created"] = getCurrentDateAsJson();
        taskList["createdBy"] = currentUser.email;
        const dbref = ref(db, '/tasklists');

        push(dbref, taskList)
            .then((snap) => {
                addTasksToTaskList(snap.key, incredients)
            })
    }

    const addTasksToTaskList = async (tasklistID, incredients) => {

        //tee reseptin aineksista taskilistaan taskeja
        incredients.forEach(function (arrayItem) {
            let name = arrayItem.name;
            let amount = arrayItem.amount;
            let unit = arrayItem.unit;

            addTask(tasklistID, { text: name, 'day': amount + ' ' + unit, 'reminder': false });
        });
    }

    const addTask = async (taskListID, task) => {
        //To firebase
        task["created"] = getCurrentDateAsJson()
        task["createdBy"] = currentUser.email;
        const dbref = child(ref(db, '/tasks'), taskListID);
        push(dbref, task);
    }

    return (
        <div key={recipe.id} className={recipe.isCore === true ? 'recipe coreRecipe' : 'recipe'}>
            <h5>
                <span>
                    <FaUtensils style={{ color: 'gray', cursor: 'pointer', marginRight: '5px', marginBottom: '3x' }} />
                    {recipe.title}
                </span>
                <FaTimes className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_recipe_confirm_message'))) { onDelete(recipe.id); } }} />
            </h5>
            {error && <div className="error">{error}</div>}
            {recipe.category > 0 ? (
                <p> {'#' + t('category_' + getRecipeCategoryNameByID(recipe.category))}</p>
            ) : ('')}
            <p>{recipe.description}</p>
            <p>
                <Link className='btn btn-primary' to={`/recipe/${recipe.id}`}>{t('view_details')}</Link>
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <span style={{ marginLeft: '5px' }}>
                        <FaShoppingCart style={{ cursor: 'pointer', marginRight: '5px', fontSize: '1.2em' }}
                            onClick={() => { if (window.confirm(t('create_shoppinglist_confirm_message'))) { makeShoppingList() } }} />
                    </span>
                </OverlayTrigger>
            </p>
            <StarRating starCount={recipe.stars} />
        </div>
    )
}

export default Recipe