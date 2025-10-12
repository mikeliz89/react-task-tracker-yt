import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Tab, Tabs, Col, Row, ButtonGroup } from 'react-bootstrap';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddIncredient from './AddIncredient';
import AddWorkPhase from './AddWorkPhase';
import Incredients from './Incredients';
import WorkPhases from './WorkPhases';
import AddRecipe from './AddRecipe';
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getRecipeCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import RecipeHistories from './RecipeHistories';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById }
    from '../../datatier/datatier';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import useFetch from '../useFetch';
import useFetchChildren from '../useFetchChildren';
import { db } from '../../firebase-config';
import { ref, child, onValue } from 'firebase/database';
import { ListTypes, RecipeTypes } from '../../utils/Enums';
import { getIncredientsUrl } from './Categories';

export default function RecipeDetails() {

    //navigate
    const navigate = useNavigate();

    //params
    const params = useParams();

    //states
    const [showEditRecipe, setShowEditRecipe] = useState(false);
    const [showAddIncredient, setShowAddIncredient] = useState(false);
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_RECIPE });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: recipe, loading } = useFetch(Constants.DB_RECIPES, "", params.id);
    const { data: incredients } = useFetchChildren(Constants.DB_RECIPE_INCREDIENTS, params.id);
    const { data: workPhases } = useFetchChildren(Constants.DB_RECIPE_WORKPHASES, params.id);
    const { data: recipeHistory } = useFetchChildren(Constants.DB_RECIPE_HISTORY, params.id);

    const deleteIncredient = async (recipeID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_RECIPE_INCREDIENTS, recipeID, id);
    }

    const deleteWorkPhase = async (recipeID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_RECIPE_WORKPHASES, recipeID, id);
    }

    const addRecipe = async (recipe) => {
        try {
            const recipeID = params.id;
            recipe["modified"] = getCurrentDateAsJson();
            if (recipe["isCore"] === undefined) {
                recipe["isCore"] = false;
            }
            updateToFirebaseById(Constants.DB_RECIPES, recipeID, recipe);
        } catch (error) {
            console.log(error)
            setError(t('failed_to_save_recipe'));
            setShowError(true);
        }
    }

    const saveStars = async (stars) => {
        const recipeID = params.id;
        recipe["modified"] = getCurrentDateAsJson()
        recipe["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_RECIPES, recipeID, recipe);
    }

    const addIncredient = async (recipeID, incredient) => {
        pushToFirebaseChild(Constants.DB_RECIPE_INCREDIENTS, recipeID, incredient);
    }

    const addWorkPhase = async (recipeID, workPhase) => {
        pushToFirebaseChild(Constants.DB_RECIPE_WORKPHASES, recipeID, workPhase);
    }

    const addCommentToRecipe = (comment) => {
        const recipeID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_RECIPE_COMMENTS, recipeID, comment);
    }

    const addLinkToRecipe = (link) => {
        const recipeID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_RECIPE_LINKS, recipeID, link);
    }

    const saveRecipeHistory = async (recipeID) => {
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;

        pushToFirebaseById(Constants.DB_RECIPE_HISTORY, recipeID, { currentDateTime, userID });

        setShowMessage(true);
        setMessage(t('save_success_recipehistoryhistory'));
    }

    const updateRecipeIncredients = async () => {
        var recipeID = params.id;
        recipe["incredients"] = getIncredientsAsText();
        updateToFirebaseById(Constants.DB_RECIPES, recipeID, recipe);
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

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(recipe.created, i18n.language) },
            { id: 2, name: t('created_by'), value: recipe.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(recipe.modified, i18n.language) },
            { id: 4, name: t('core_recipe'), value: recipe.isCore === true ? t('yes') : t('no') },
            { id: 5, name: t('category'), value: t('category_' + getRecipeCategoryNameByID(recipe.category)) }
        ];
    }

    const makeShoppingList = async (recipeID) => {

        const incredients = await fetchIncredientsFromFirebase(recipeID);

        if (incredients && incredients.length > 0) {
            let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
            addTaskList({ title: `${t('shoppinglist')} ${currentDateTime}` }, incredients).then(() => {
                navigate(Constants.NAVIGATION_MANAGE_SHOPPINGLISTS)
            });
        } else if (incredients && incredients.length <= 0) {
            setError(t('shoppinglist_no_incredients')); 
            setShowError(true);
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

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEditRecipe ? tCommon('buttons.button_close') : ''}
                        color={showEditRecipe ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => setShowEditRecipe(!showEditRecipe)} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={recipe.title} iconName={Constants.ICON_UTENSILS} />

            <Row>
                <Col>
                    {t('description') + ': '} {recipe.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    {t('incredients') + ': '} {recipe.incredients}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRatingWrapper stars={recipe.stars} onSaveStars={saveStars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_SUCCESS}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            {/* <pre>{JSON.stringify(recipe)}</pre> */}
            {showEditRecipe &&
                <AddRecipe
                    onClose={() => setShowEditRecipe(false)} onSave={addRecipe} recipeID={params.id} />}

            <Tabs defaultActiveKey="home"
                id="recipeDetails-Tab"
                className="mb-3">
                <Tab eventKey="home" title={t("incredients_header")}>
                    <Button
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_CARROT}
                        color={showAddIncredient ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                        text={showAddIncredient ? tCommon('buttons.button_close') : ''}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    {showAddIncredient &&
                        <AddIncredient
                            dbUrl={Constants.DB_RECIPE_INCREDIENTS}
                            translation={Constants.TRANSLATION}
                            translationKeyPrefix={Constants.TRANSLATION_RECIPE}
                            onSave={addIncredient}
                            recipeID={params.id}
                            onClose={() => setShowAddIncredient(false)}
                        />}
                    {incredients != null}
                    {incredients != null && incredients.length > 0 ? (
                        <>
                            <Button iconName={Constants.ICON_SYNC} onClick={updateRecipeIncredients} />
                            <Incredients
                                dbUrl={Constants.DB_RECIPE_INCREDIENTS}
                                translation={Constants.TRANSLATION}
                                translationKeyPrefix={Constants.TRANSLATION_RECIPE}
                                recipeID={params.id}
                                incredients={incredients}
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
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_HOURGLASS_1}
                        color={showAddWorkPhase ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
                        text={showAddWorkPhase ? tCommon('buttons.button_close') : ''}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                    {showAddWorkPhase &&
                        <AddWorkPhase
                            dbUrl={Constants.DB_RECIPE_WORKPHASES}
                            translation={Constants.TRANSLATION}
                            translationKeyPrefix={Constants.TRANSLATION_RECIPE}
                            onSave={addWorkPhase}
                            recipeID={params.id}
                            onClose={() => setShowAddWorkPhase(false)} />
                    }
                    {workPhases != null}
                    {workPhases != null && workPhases.length > 0 ? (
                        <WorkPhases
                            dbUrl={Constants.DB_RECIPE_WORKPHASES}
                            translation={Constants.TRANSLATION}
                            translationKeyPrefix={Constants.TRANSLATION_RECIPE}
                            recipeID={params.id}
                            workPhases={workPhases}
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
                            iconName={Constants.ICON_PLUS_SQUARE}
                            text={t('do_recipe')}
                            onClick={() => {
                                if (window.confirm(t('do_recipe_confirm'))) { saveRecipeHistory(params.id); }
                            }}
                        />
                        &nbsp;
                        <Button
                            iconName={Constants.ICON_PLUS_SQUARE}
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
            <hr />
            {
                recipeHistory != null && recipeHistory.length > 0 ? (
                    <RecipeHistories
                        dbUrl={Constants.DB_RECIPE_HISTORY}
                        translation={Constants.TRANSLATION}
                        translationKeyPrefix={Constants.TRANSLATION_RECIPE}
                        recipeHistories={recipeHistory} recipeID={params.id} />
                ) : (
                    t('no_recipe_history')
                )
            }

            <ImageComponent objID={params.id} url={Constants.DB_RECIPE_IMAGES} />

            <CommentComponent objID={params.id} url={Constants.DB_RECIPE_COMMENTS} onSave={addCommentToRecipe} />

            <LinkComponent objID={params.id} url={Constants.DB_RECIPE_LINKS} onSaveLink={addLinkToRecipe} />

        </PageContentWrapper>
    )
}
