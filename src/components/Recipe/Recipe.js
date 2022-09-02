//react
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useState } from 'react'
//star rating
import StarRating from '../StarRating/StarRating';
//firebase
import { db } from '../../firebase-config';
import { ref, push, child, onValue } from "firebase/database";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getRecipeCategoryNameByID, getDrinkCategoryNameByID } from '../../utils/ListUtils';
//auth
import { useAuth } from '../../contexts/AuthContext';
//i18n
import i18n from "i18next";
//icon
import Icon from '../Icon';
//categories
import { getIconNameByCategory } from './Categories';
//alert
import Alert from '../Alert';
//proptypes
import PropTypes from 'prop-types';
//recipetypes
import { ListTypes, RecipeTypes } from '../../utils/Enums';

const Recipe = ({ recipeType, translation, recipe, onDelete }) => {

    //constants
    const DB_TASKS = '/tasks';
    const DB_TASKLISTS = '/tasklists';

    //navigate
    const navigate = useNavigate();

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translation });

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {t('shopcart_tooltip')}
        </Tooltip>
    );

    const makeShoppingList = async () => {
        const incredients = await fetchIncredientsFromFirebase(recipe.id);

        if (incredients && incredients.length > 0) {
            let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
            addTaskList({ title: `${t('shoppinglist')} ${currentDateTime}` }, incredients).then(() => {
                navigate('/manageshoppinglists')
            });
        } else if (incredients && incredients.length <= 0) {
            setError("Ei yhtään ainesosaa. Ostoslistaa ei voitu luoda"); //todo: kieleistys
            setShowError(true);
        }
    }

    const fetchIncredientsFromFirebase = async (recipeID) => {
        const incredients = [];
        const dbref = await child(ref(db, getIncredientsUrl()), recipeID);
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
        taskList["description"] = "";
        taskList["listType"] = ListTypes.Shopping;
        const dbref = ref(db, DB_TASKLISTS);

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
        task["created"] = getCurrentDateAsJson()
        task["createdBy"] = currentUser.email;
        const dbref = child(ref(db, DB_TASKS), taskListID);
        push(dbref, task);
    }

    const getIconName = (category) => {
        switch (recipeType) {
            case RecipeTypes.Food:
                return getIconNameByCategory(category);
            case RecipeTypes.Drink:
                return 'glass-martini';
            default: return '';
        }
    }

    const getCategory = (category) => {
        switch (recipeType) {
            case RecipeTypes.Food:
                return '#' + t('category_' + getRecipeCategoryNameByID(category));
            case RecipeTypes.Drink:
                return '#' + t('category_' + getDrinkCategoryNameByID(category));
            default: return '';
        }
    }

    const getIncredientsUrl = () => {
        switch (recipeType) {
            case RecipeTypes.Food:
                return '/recipe-incredients';
            case RecipeTypes.Drink:
                return '/drink-incredients';
            default: return '';
        }
    }

    const getViewDetailsUrl = () => {
        switch (recipeType) {
            case RecipeTypes.Food:
                return '/recipe';
            case RecipeTypes.Drink:
                return '/drink';
            default: return '';
        }
    }

    return (
        <div className={recipe.isCore === true ? `${translation} coreRecipe` : translation}>
            <h5>
                <span>
                    <Icon name={getIconName(recipe.category)} color='gray' />
                    {recipe.title}
                </span>
                <Icon name='times' className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                    onClick={() => { if (window.confirm(t('delete_recipe_confirm_message'))) { onDelete(recipe.id); } }} />
            </h5>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {recipe.category > 0 ? (
                <p> {getCategory(recipe.category)}</p>
            ) : ('')}
            <p>{recipe.description}</p>
            <p>
                <Link className='btn btn-primary' to={`${getViewDetailsUrl()}/${recipe.id}`}>{t('view_details')}</Link>
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

Recipe.defaultProps = {
    translation: '',
    recipeType: RecipeTypes.None
}

Recipe.propTypes = {
    translation: PropTypes.string,
    onDelete: PropTypes.func,
    recipeType: PropTypes.any,
    recipe: PropTypes.object
}