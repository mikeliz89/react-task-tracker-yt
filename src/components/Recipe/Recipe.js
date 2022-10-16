import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useState } from 'react'
import StarRating from '../StarRating/StarRating';
import { db } from '../../firebase-config';
import { ref, child, onValue } from 'firebase/database';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import i18n from "i18next";
import Icon from '../Icon';
import { getCategoryContent, getIncredientsUrl, getIconName, getViewDetailsUrl, getUrl } from './Categories';
import Alert from '../Alert';
import PropTypes from 'prop-types';
import { ListTypes, RecipeTypes } from '../../utils/Enums';
import { pushToFirebase, pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import RightWrapper from '../RightWrapper';
import AddRecipe from './AddRecipe';
import AddDrink from '../Drinks/AddDrink';

const Recipe = ({ recipeType, translation, recipe, onDelete }) => {

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

    //states
    const [editable, setEditable] = useState(false);

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
                navigate(Constants.NAVIGATION_MANAGE_SHOPPINGLISTS)
            });
        } else if (incredients && incredients.length <= 0) {
            setError("Ei yhtään ainesosaa. Ostoslistaa ei voitu luoda"); //todo: kieleistys
            setShowError(true);
        }
    }

    const fetchIncredientsFromFirebase = async (recipeID) => {
        const incredients = [];
        const dbref = await child(ref(db, getIncredientsUrl(recipeType)), recipeID);
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

        const key = await pushToFirebase(Constants.DB_TASKLISTS, taskList);
        addTasksToTaskList(key, incredients);
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
        pushToFirebaseChild(Constants.DB_TASKS, taskListID, task);
    }

    const getCategory = (category) => {
        return '#' + t('category_' + getCategoryContent(recipeType, category));
    }

    const updateRecipe = async (recipeToUpdate) => {
        try {
            const recipeID = recipe.id;
            recipeToUpdate["modified"] = getCurrentDateAsJson();
            if (recipeToUpdate["isCore"] === undefined) {
                recipeToUpdate["isCore"] = false;
            }
            updateToFirebaseById(getUrl(recipeType), recipeID, recipeToUpdate);
        } catch (error) {
            setError(t('failed_to_save_drink'));
            setShowError(true);
            console.log(error)
        }
    }

    return (
        <div className={recipe.isCore === true ? `listContainer coreRecipe` : 'listContainer'}>
            <h5>
                <span>
                    <Icon name={getIconName(recipeType, recipe.category)} color='gray' />
                    {recipe.title}
                </span>
                <RightWrapper>
                    <Icon name={Constants.ICON_EDIT} className="editBtn" style={{ color: 'light-gray', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => editable ? setEditable(false) : setEditable(true)} />
                    <Icon name={Constants.ICON_DELETE} className="deleteBtn" style={{ color: 'red', cursor: 'pointer', fontSize: '1.2em' }}
                        onClick={() => { if (window.confirm(t('delete_recipe_confirm_message'))) { onDelete(recipe.id); } }} />
                </RightWrapper>
            </h5>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {recipe.category > 0 ? (
                <p> {getCategory(recipe.category)}</p>
            ) : ('')}
            <p>{recipe.description}</p>
            <p>{recipe.incredients}</p>
            <p>
                <Link className='btn btn-primary' to={`${getViewDetailsUrl(recipeType)}/${recipe.id}`}>{t('view_details')}</Link>
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
            {
                editable && (
                    recipeType === RecipeTypes.Food && (
                        <AddRecipe
                            recipeID={recipe.id}
                            onClose={() => setEditable(false)}
                            onSave={updateRecipe} />) ||
                    recipeType === RecipeTypes.Drink && (
                        <AddDrink
                            drinkID={recipe.id}
                            onClose={() => setEditable(false)}
                            onSave={updateRecipe} />
                    )
                )
            }
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