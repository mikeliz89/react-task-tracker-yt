import { ref, child, onValue } from 'firebase/database';
import i18n from "i18next";
import { useState } from 'react';
import { ButtonGroup, Form, Tab, Tabs } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseById, removeFromFirebaseByIdAndSubId, updateToFirebaseById }
    from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { COLORS, NAVIGATION, DB, TRANSLATION, ICONS } from '../../utils/Constants';
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { ListTypes, RecipeTypes } from '../../utils/Enums';
import { getRecipeCategoryNameByID } from '../../utils/ListUtils';
import Button from '../Buttons/Button';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import useFetchChildren from '../Hooks/useFetchChildren';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import CenterWrapper from '../Site/CenterWrapper';
import DetailsPage from '../Site/DetailsPage';

import AddIncredient from './AddIncredient';
import AddRecipe from './AddRecipe';
import AddWorkPhase from './AddWorkPhase';
import { getIncredientsUrl } from './Categories';
import Incredients from './Incredients';
import RecipeHistories from './RecipeHistories';
import WorkPhases from './WorkPhases';

export default function RecipeDetails() {

    //navigate
    const navigate = useNavigate();

    //params
    const params = useParams();

    //states
    const [showEditRecipe, setShowEditRecipe] = useState(false);
    const [showAddIncredient, setShowAddIncredient] = useState(false);
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false);
    const [showBulkIncredients, setShowBulkIncredients] = useState(false);
    const [bulkIncredientsText, setBulkIncredientsText] = useState('');

    //alert
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.RECIPE });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: recipe, loading } = useFetch(DB.RECIPES, "", params.id);
    const { data: incredients } = useFetchChildren(DB.RECIPE_INCREDIENTS, params.id);
    const { data: workPhases } = useFetchChildren(DB.RECIPE_WORKPHASES, params.id);
    const { data: recipeHistory } = useFetchChildren(DB.RECIPE_HISTORY, params.id);

    const deleteIncredient = async (recipeID, id) => {
        removeFromFirebaseByIdAndSubId(DB.RECIPE_INCREDIENTS, recipeID, id);
    }

    const deleteWorkPhase = async (recipeID, id) => {
        removeFromFirebaseByIdAndSubId(DB.RECIPE_WORKPHASES, recipeID, id);
    }

    const addRecipe = async (recipe) => {
        try {
            const recipeID = params.id;
            recipe["modified"] = getCurrentDateAsJson();
            if (recipe["isCore"] === undefined) {
                recipe["isCore"] = false;
            }
            updateToFirebaseById(DB.RECIPES, recipeID, recipe);
        } catch (error) {
            showFailure(t('failed_to_save_recipe'));
            console.warn(error);
        }
    }

    const addIncredient = async (recipeID, incredient) => {
        pushToFirebaseChild(DB.RECIPE_INCREDIENTS, recipeID, incredient);
    }

    const addBulkIncredients = async () => {
        const names = bulkIncredientsText
            .split(/[\n,]+/)
            .map((name) => name.trim())
            .filter((name) => name.length > 0);

        if (names.length === 0) {
            showFailure(t('no_incredients_to_show'));
            return;
        }

        await Promise.all(names.map((name) => addIncredient(params.id, { name, unit: '', amount: 0 })));
        setBulkIncredientsText('');
    }

    const addWorkPhase = async (recipeID, workPhase) => {
        pushToFirebaseChild(DB.RECIPE_WORKPHASES, recipeID, workPhase);
    }

    const addCommentToRecipe = (comment) => {
        const recipeID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.RECIPE_COMMENTS, recipeID, comment);
    }

    const addLinkToRecipe = (link) => {
        const recipeID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.RECIPE_LINKS, recipeID, link);
    }

    const saveRecipeHistory = async (recipeID) => {
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;

        pushToFirebaseById(DB.RECIPE_HISTORY, recipeID, { currentDateTime, userID });

        showSuccess(t('save_success_recipehistoryhistory'));
    }

    const updateRecipeIncredients = async () => {
        var recipeID = params.id;
        recipe["incredients"] = getIncredientsAsText();
        updateToFirebaseById(DB.RECIPES, recipeID, recipe);
    }

    const deleteAllIncredients = async () => {
        if (incredients == null || incredients.length === 0) {
            showFailure(t('no_incredients_to_show'));
            return;
        }

        if (!window.confirm(`${tCommon('buttons.button_delete')} ${t('incredients_header')}?`)) {
            return;
        }

        await removeFromFirebaseById(DB.RECIPE_INCREDIENTS, params.id);
    }

    const getIncredientsAsText = () => {
        //hakee kaikki namet taulukoksi
        var names = incredients.map(function (item) {
            return item['name'];
        });
        //korvataan pilkut pilkku-välilyönneillä
        const search = ',';
        const replaceWith = ', ';
        const result = names.toString().split(search).join(replaceWith);
        //muutetaan lopuksi vielä stringiksi
        return result.toString();
    }

    const makeShoppingList = async (recipeID) => {

        const incredients = await fetchIncredientsFromFirebase(recipeID);

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
        console.log("recipeID ID ", recipeID);
        const incredients = [];
        const recipeType = RecipeTypes.Food;
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

    return (
        <DetailsPage
            dbKey={DB.RECIPES}
            item={recipe}
            id={params.id}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEditRecipe}
            onToggleEdit={() => setShowEditRecipe(!showEditRecipe)}
            title={recipe?.title}
            preSummaryContent={
                <>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                        <span className="detailspage-meta-value">{t(`category_${getRecipeCategoryNameByID(recipe?.category)}`)}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('core_recipe')}:</span>{' '}
                        <span className="detailspage-meta-value">{recipe?.isCore === true ? t('yes') : t('no')}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('incredients')}:</span>{' '}
                        <span className="detailspage-meta-value">{recipe?.incredients || '-'}</span>
                    </div>
                </>
            }
            summary={`${t('description')}: ${recipe?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(recipe?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{recipe?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(recipe?.modified, i18n.language)}</span></>
                }
            ]}
            editSection={<AddRecipe onClose={() => setShowEditRecipe(false)} onSave={addRecipe} recipeID={params.id} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages
            }}
            preImageSection={
                <>
                    <Tabs defaultActiveKey="home"
                        id="recipeDetails-Tab"
                        className="mb-3">
                        <Tab eventKey="home" title={t("incredients_header")}>

                            <ButtonGroup className="mb-2">
                                <Button
                                    iconName={ICONS.PLUS}
                                    secondIconName={ICONS.CARROT}
                                    color={showBulkIncredients ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                                    text={showBulkIncredients ? tCommon('buttons.button_close') : `${t('incredient_name')} (a, b, c)`}
                                    onClick={() => setShowBulkIncredients(!showBulkIncredients)} />

                                <Button
                                    iconName={ICONS.PLUS}
                                    secondIconName={ICONS.CARROT}
                                    color={showAddIncredient ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                                    text={showAddIncredient ? tCommon('buttons.button_close') : ''}
                                    onClick={() => setShowAddIncredient(!showAddIncredient)} />


                                {incredients != null && incredients.length > 0 &&
                                    <>
                                        <Button iconName={ICONS.SYNC} onClick={updateRecipeIncredients} />
                                        <Button iconName={ICONS.DELETE} onClick={deleteAllIncredients} text={tCommon('buttons.button_delete_all')} />
                                    </>
                                }
                            </ButtonGroup>

                            {showBulkIncredients &&
                                <>
                                    <Form.Group className="mb-3" controlId="bulkIncredientsInput">
                                        <Form.Label>{t('incredient_name')} (a, b, c)</Form.Label>
                                        <Form.Control
                                            autoComplete="off"
                                            type="text"
                                            placeholder={t('incredient_name')}
                                            value={bulkIncredientsText}
                                            onChange={(e) => setBulkIncredientsText(e.target.value)}
                                        />
                                    </Form.Group>
                                    <Button
                                        iconName={ICONS.PLUS}
                                        text={t('button_save_multiple_incredients')}
                                        onClick={addBulkIncredients}
                                    />
                                </>
                            }

                            {showAddIncredient &&
                                <AddIncredient
                                    dbUrl={DB.RECIPE_INCREDIENTS}
                                    translation={TRANSLATION.TRANSLATION}
                                    translationKeyPrefix={TRANSLATION.RECIPE}
                                    onSave={addIncredient}
                                    recipeID={params.id}
                                    onClose={() => setShowAddIncredient(false)}
                                />}
                            {incredients != null}
                            {incredients != null && incredients.length > 0 ? (
                                <>
                                    <Incredients
                                        dbUrl={DB.RECIPE_INCREDIENTS}
                                        translation={TRANSLATION.TRANSLATION}
                                        translationKeyPrefix={TRANSLATION.RECIPE}
                                        recipeID={params.id}
                                        items={incredients}
                                        onDelete={deleteIncredient}
                                    />
                                </>
                            ) : (
                                <>
                                    <CenterWrapper>
                                        {t('no_incredients_to_show')}
                                    </CenterWrapper>
                                </>
                            )}
                        </Tab>
                        <Tab eventKey="workPhases" title={t('workphases_header')}>
                            <Button
                                iconName={ICONS.PLUS}
                                secondIconName={ICONS.HOURGLASS_1}
                                color={showAddWorkPhase ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                                text={showAddWorkPhase ? tCommon('buttons.button_close') : ''}
                                onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                            {showAddWorkPhase &&
                                <AddWorkPhase
                                    dbUrl={DB.RECIPE_WORKPHASES}
                                    translation={TRANSLATION.TRANSLATION}
                                    translationKeyPrefix={TRANSLATION.RECIPE}
                                    onSave={addWorkPhase}
                                    recipeID={params.id}
                                    onClose={() => setShowAddWorkPhase(false)} />
                            }
                            {workPhases != null}
                            {workPhases != null && workPhases.length > 0 ? (
                                <WorkPhases
                                    dbUrl={DB.RECIPE_WORKPHASES}
                                    translation={TRANSLATION.TRANSLATION}
                                    translationKeyPrefix={TRANSLATION.RECIPE}
                                    recipeID={params.id}
                                    items={workPhases}
                                    onDelete={deleteWorkPhase}
                                />
                            ) : (
                                <>
                                    <CenterWrapper>
                                        {t('no_workphases_to_show')}
                                    </CenterWrapper>
                                </>
                            )}
                        </Tab>
                        <Tab eventKey="actions" title={t('tabheader_actions')}>
                            <>
                                <Button
                                    iconName={ICONS.PLUS_SQUARE}
                                    text={t('do_recipe')}
                                    onClick={() => {
                                        if (window.confirm(t('do_recipe_confirm'))) { saveRecipeHistory(params.id); }
                                    }}
                                />
                                &nbsp;
                                <Button
                                    iconName={ICONS.PLUS_SQUARE}
                                    text={t('shopcart_tooltip')}
                                    onClick={() => {
                                        if (window.confirm(t('shopcart_tooltip_confirm'))) {
                                            makeShoppingList(params.id);
                                        }
                                    }}
                                />
                            </>
                        </Tab>
                    </Tabs>

                    {
                        recipeHistory != null && recipeHistory.length > 0 ? (
                            <RecipeHistories
                                dbUrl={DB.RECIPE_HISTORY}
                                translation={TRANSLATION.TRANSLATION}
                                translationKeyPrefix={TRANSLATION.RECIPE}
                                recipeHistories={recipeHistory} recipeID={params.id} />
                        ) : (
                            t('no_recipe_history')
                        )
                    }
                </>
            }
            imageSection={<ImageComponent objID={params.id} url={DB.RECIPE_IMAGES} />}
            commentSection={<CommentComponent objID={params.id} url={DB.RECIPE_COMMENTS} onSave={addCommentToRecipe} />}
            linkSection={<LinkComponent objID={params.id} url={DB.RECIPE_LINKS} onSaveLink={addLinkToRecipe} />}
        />
    )
}



