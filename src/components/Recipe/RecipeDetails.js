//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Row, ButtonGroup, Accordion, Table } from 'react-bootstrap';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
//firebase
import { db } from '../../firebase-config';
import { push, child, remove, ref, onValue, update } from "firebase/database";
//Buttons
import GoBackButton from '../GoBackButton';
import Button from '../../components/Button';
//Recipe
import AddIncredient from './AddIncredient';
import AddWorkPhase from './AddWorkPhase';
import Incredients from './Incredients';
import WorkPhases from './WorkPhases';
import AddRecipe from './AddRecipe';
//i18n
import i18n from "i18next";
//utils
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getRecipeCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
//StarRating
import SetStarRating from '../StarRating/SetStarRating';
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//Comments
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//auth
import { useAuth } from '../../contexts/AuthContext';
//pagetitle
import PageTitle from '../PageTitle';
//alert
import Alert from '../Alert';
import StarRating from '../StarRating/StarRating';
import RecipeHistories from './RecipeHistories';
import PageContentWrapper from '../PageContentWrapper';
import CenterWrapper from '../CenterWrapper';

export default function RecipeDetails() {


    //states
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState({});
    const [recipeHistory, setRecipeHistory] = useState({});
    const [showEditRecipe, setShowEditRecipe] = useState(false);
    const [showAddIncredient, setShowAddIncredient] = useState(false);
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false);
    const [incredients, setIncredients] = useState();
    const [workPhases, setWorkPhases] = useState();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_RECIPE, { keyPrefix: Constants.TRANSLATION_RECIPE });

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getRecipe = async () => {
            await fetchRecipeFromFirebase();
        }
        getRecipe();
        const getIncredients = async () => {
            await fetchIncredientsFromFirebase();
        }
        getIncredients();
        const getWorkPhases = async () => {
            await fetchWorkPhasesFromFirebase();
        }
        getWorkPhases();
        const getRecipeHistory = async () => {
            await fetchRecipeHistoryFromFirebase();
        }
        getRecipeHistory();
    }, [])

    const fetchRecipeFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_RECIPES}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setRecipe(data);
            setLoading(false);
        })
    }


    const fetchRecipeHistoryFromFirebase = async () => {
        const dbref = await child(ref(db, Constants.DB_RECIPE_HISTORY), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setRecipeHistory(fromDB);
        })
    }

    const fetchIncredientsFromFirebase = async () => {
        const dbref = await child(ref(db, Constants.DB_RECIPE_INCREDIENTS), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setIncredients(fromDB);
        })
    }

    const fetchWorkPhasesFromFirebase = async () => {
        const dbref = await child(ref(db, Constants.DB_RECIPE_WORKPHASES), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setWorkPhases(fromDB);
        })
    }

    const addIncredient = async (recipeID, incredient) => {
        const dbref = child(ref(db, Constants.DB_RECIPE_INCREDIENTS), recipeID);
        push(dbref, incredient);
    }

    const deleteIncredient = async (recipeID, id) => {
        const dbref = ref(db, `${Constants.DB_RECIPE_INCREDIENTS}/${recipeID}/${id}`);
        remove(dbref)
    }

    const addWorkPhase = async (recipeID, workPhase) => {
        const dbref = child(ref(db, Constants.DB_RECIPE_WORKPHASES), recipeID);
        push(dbref, workPhase);
    }

    const deleteWorkPhase = async (recipeID, id) => {
        const dbref = ref(db, `${Constants.DB_RECIPE_WORKPHASES}/${recipeID}/${id}`);
        remove(dbref);
    }

    const addRecipe = async (recipe) => {
        try {
            const recipeID = params.id;
            const updates = {};
            recipe["modified"] = getCurrentDateAsJson();
            if (recipe["stars"] === undefined) {
                recipe["stars"] = 0;
            }
            if (recipe["isCore"] === undefined) {
                recipe["isCore"] = false;
            }
            updates[`${Constants.DB_RECIPES}/${recipeID}`] = recipe;
            update(ref(db), updates);
        } catch (error) {
            console.log(error)
            setError(t('failed_to_save_recipe'));
            setShowError(true);
        }
    }

    const saveStars = async (stars) => {
        const recipeID = params.id;
        const updates = {};
        recipe["modified"] = getCurrentDateAsJson()
        recipe["stars"] = Number(stars);
        updates[`${Constants.DB_RECIPES}/${recipeID}`] = recipe;
        update(ref(db), updates);
    }

    const addCommentToRecipe = (comment) => {
        const recipeID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, Constants.DB_RECIPE_COMMENTS), recipeID);
        push(dbref, comment);
    }

    const addLinkToRecipe = (link) => {
        const recipeID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, Constants.DB_RECIPE_LINKS), recipeID);
        push(dbref, link);
    }

    const saveRecipeHistory = async (recipeID) => {
        const dbref = ref(db, `${Constants.DB_RECIPE_HISTORY}/${recipeID}`);
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;
        push(dbref, { currentDateTime, userID });

        setShowMessage(true);
        setMessage(t('save_success_recipehistoryhistory'));
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='edit'
                        text={showEditRecipe ? t('button_close') : ''}
                        color={showEditRecipe ? 'red' : 'orange'}
                        onClick={() => setShowEditRecipe(!showEditRecipe)} />
                </ButtonGroup>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <PageTitle title={recipe.title} iconName='utensils' iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
                                {t('description')}: {recipe.description}<br />
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                            <td>{t('created')}</td>
                                            <td>{getJsonAsDateTimeString(recipe.created, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('created_by')}</td>
                                            <td>{recipe.createdBy}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('modified')}</td>
                                            <td>{getJsonAsDateTimeString(recipe.modified, i18n.language)}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('core_recipe')}</td>
                                            <td>{recipe.isCore === true ? t('yes') : t('no')}</td>
                                        </tr>
                                        <tr>
                                            <td>{t('category')}</td>
                                            <td>{t('category_' + getRecipeCategoryNameByID(recipe.category))}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRating starCount={recipe.stars} />
                </Col>
            </Row>

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {/* <pre>{JSON.stringify(recipe)}</pre> */}
            {showEditRecipe && <AddRecipe
                onClose={() => setShowEditRecipe(false)} onAddRecipe={addRecipe} recipeID={params.id} />}

            <Tabs defaultActiveKey="home"
                id="recipeDetails-Tab"
                className="mb-3">
                <Tab eventKey="home" title={t('incredients_header')}>
                    <Button
                        iconName='plus'
                        secondIconName='carrot'
                        color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : ''}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    {showAddIncredient &&
                        <AddIncredient
                            dbUrl={Constants.DB_RECIPE_INCREDIENTS}
                            translation={Constants.TRANSLATION_RECIPE}
                            onSave={addIncredient}
                            recipeID={params.id}
                            onClose={() => setShowAddIncredient(false)}
                        />}
                    {incredients != null}
                    {incredients != null && incredients.length > 0 ? (
                        <Incredients
                            dbUrl={Constants.DB_RECIPE_INCREDIENTS}
                            translation={Constants.TRANSLATION_RECIPE}
                            recipeID={params.id}
                            incredients={incredients}
                            onDelete={deleteIncredient}
                        />
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
                        iconName='plus'
                        secondIconName='hourglass-1'
                        color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : ''}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                    {showAddWorkPhase &&
                        <AddWorkPhase
                            dbUrl={Constants.DB_RECIPE_WORKPHASES}
                            translation={Constants.TRANSLATION_RECIPE}
                            onSave={addWorkPhase}
                            recipeID={params.id}
                            onClose={() => setShowAddWorkPhase(false)} />
                    }
                    {workPhases != null}
                    {workPhases != null && workPhases.length > 0 ? (
                        <WorkPhases
                            dbUrl={Constants.DB_RECIPE_WORKPHASES}
                            translation={Constants.TRANSLATION_RECIPE}
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
                <Tab eventKey="actions" title="Toiminnot">
                    <SetStarRating starCount={recipe.stars} onSaveStars={saveStars} />
                    <AddComment onSave={addCommentToRecipe} />
                    <AddLink onSaveLink={addLinkToRecipe} />
                    <Button
                        iconName='plus-square'
                        text={t('do_recipe')}
                        onClick={() => { if (window.confirm(t('do_recipe_confirm'))) { saveRecipeHistory(params.id); } }}
                    />
                </Tab>
            </Tabs>
            <hr />
            {
                recipeHistory != null && recipeHistory.length > 0 ? (
                    <RecipeHistories
                        dbUrl={Constants.DB_RECIPE_HISTORY}
                        translation={Constants.TRANSLATION_RECIPE}
                        recipeHistories={recipeHistory} recipeID={params.id} />
                ) : (
                    t('no_recipe_history')
                )
            }
            <Comments objID={params.id} url={'recipe-comments'} />
            <Links objID={params.id} url={'recipe-links'} />

        </PageContentWrapper>
    )
}
