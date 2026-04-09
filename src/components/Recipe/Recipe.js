import { ref, child, onValue } from 'firebase/database';
import i18n from "i18next";
import PropTypes from 'prop-types';
import { useState } from 'react'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, pushToFirebaseChild, updateToFirebaseById } from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { COLORS, DB, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { ListTypes, RecipeTypes } from '../../utils/Enums';
import NavButton from '../Buttons/NavButton';
import AddDrink from '../Drinks/AddDrink';
import { useAlert } from '../Hooks/useAlert';
import ListRow from '../Site/ListRow';

import AddRecipe from './AddRecipe';
import { getCategoryContent, getIncredientsUrl, getIconName, getViewDetailsUrl, getUrl } from './Categories';

export default function Recipe({ recipeType, translation, translationKeyPrefix, recipe, onDelete }) {

    //navigate
    const navigate = useNavigate();

    //user
    const { currentUser } = useAuth();

    //translation
    const { t } = useTranslation(translation, { keyPrefix: translationKeyPrefix });

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showFailure
    } = useAlert();

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
                navigate(NAVIGATION.MANAGE_SHOPPINGLISTS)
            });
        } else if (incredients && incredients.length <= 0) {
            showFailure(t('shoppinglist_no_incredients'));
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

        const key = await pushToFirebase(DB.TASKLISTS, taskList);
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
        pushToFirebaseChild(DB.TASKS, taskListID, task);
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
            showFailure(t('failed_to_save_drink'));
            console.warn(error);
        }
    }

    return (
        <ListRow
            className={recipe.isCore === true ? 'coreRecipe' : ''}
            headerLeft={
                <span>
                    <NavButton to={`${getViewDetailsUrl(recipeType)}/${recipe.id}`} className=""
                        icon={getIconName(recipeType, recipe.category)} iconColor={COLORS.LIGHT_GRAY}>
                        {recipe.title}
                    </NavButton>
                </span>
            }
            actionsExtra={
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <span>
                        <FaShoppingCart style={{ cursor: 'pointer', marginRight: '5px', fontSize: '1.2em', color: COLORS.LIGHT_GRAY }}
                            onClick={() => { if (window.confirm(t('create_shoppinglist_confirm_message'))) { makeShoppingList() } }} />
                    </span>
                </OverlayTrigger>
            }
            showEditButton={true}
            editable={editable}
            setEditable={setEditable}
            showDeleteButton={true}
            onDelete={onDelete}
            deleteId={recipe.id}
            alert={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
            }}
            starCount={recipe.stars}
        >
            {recipe.category > 0 ? !editable && (
                <p> {getCategory(recipe.category)}</p>
            ) : ('')}
            {!editable &&
                <p>{recipe.description}</p>
            }
            {!editable &&
                <p>{recipe.incredients}</p>
            }
            {
                editable && ((
                    recipeType === RecipeTypes.Food && (
                        <AddRecipe
                            showLabels={false}
                            recipeID={recipe.id}
                            onClose={() => setEditable(false)}
                            onSave={updateRecipe} />)) ||
                    (recipeType === RecipeTypes.Drink && (
                        <AddDrink
                            showLabels={false}
                            drinkID={recipe.id}
                            onClose={() => setEditable(false)}
                            onSave={updateRecipe} />
                    ))
                )
            }
        </ListRow>
    )
}

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



