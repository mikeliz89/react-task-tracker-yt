//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Row, ButtonGroup, Accordion, Table } from 'react-bootstrap';
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

export default function RecipeDetails() {

    const DB_RECIPES = '/recipes';
    const DB_INCREDIENTS = '/recipe-incredients';
    const DB_WORKPHASES = '/recipe-workphases';
    const DB_RECIPE_COMMENTS = '/recipe-comments';
    const DB_RECIPE_LINKS = '/recipe-links';

    //states
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState({});
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
    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });

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
        getRecipe()
        const getIncredients = async () => {
            await fetchIncredientsFromFirebase()
        }
        getIncredients()
        const getWorkPhases = async () => {
            await fetchWorkPhasesFromFirebase()
        }
        getWorkPhases()
    }, [])

    /** Fetch Recipe From Firebase */
    const fetchRecipeFromFirebase = async () => {
        const dbref = ref(db, `${DB_RECIPES}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1)
            }
            setRecipe(data)
            setLoading(false);
        })
    }

    /** Fetch Incredients From Firebase */
    const fetchIncredientsFromFirebase = async () => {
        const dbref = await child(ref(db, DB_INCREDIENTS), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const incredients = [];
            for (let id in snap) {
                incredients.push({ id, ...snap[id] });
            }
            setIncredients(incredients);
        })
    }

    /** Fetch WorkPhases From Firebase */
    const fetchWorkPhasesFromFirebase = async () => {
        const dbref = await child(ref(db, DB_WORKPHASES), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const workphases = [];
            for (let id in snap) {
                workphases.push({ id, ...snap[id] });
            }
            setWorkPhases(workphases);
        })
    }

    /** Add Incredient To Firebase */
    const addIncredient = async (recipeID, incredient) => {
        const dbref = child(ref(db, DB_INCREDIENTS), recipeID);
        push(dbref, incredient);
    }

    /** Delete Incredient From Firebase */
    const deleteIncredient = async (recipeID, id) => {
        const dbref = ref(db, `${DB_INCREDIENTS}/${recipeID}/${id}`);
        remove(dbref)
    }

    /** Add Work Phase To Firebase */
    const addWorkPhase = async (recipeID, workPhase) => {
        const dbref = child(ref(db, DB_WORKPHASES), recipeID);
        push(dbref, workPhase);
    }

    /** Delete Work Phase From Firebase */
    const deleteWorkPhase = async (recipeID, id) => {
        const dbref = ref(db, `${DB_WORKPHASES}/${recipeID}/${id}`);
        remove(dbref);
    }

    /** Add Recipe To Firebase */
    const addRecipe = async (recipe) => {
        try {
            const recipeID = params.id;
            //save edited recipe to firebase
            const updates = {};
            recipe["modified"] = getCurrentDateAsJson();
            if (recipe["stars"] === undefined) {
                recipe["stars"] = 0;
            }
            if (recipe["isCore"] === undefined) {
                recipe["isCore"] = false;
            }
            updates[`${DB_RECIPES}/${recipeID}`] = recipe;
            update(ref(db), updates);
        } catch (error) {
            console.log(error)
            setError(t('failed_to_save_recipe'));
            setShowError(true);
        }
    }

    const saveStars = async (stars) => {
        const recipeID = params.id;
        //save edited recipe to firebase
        const updates = {};
        recipe["modified"] = getCurrentDateAsJson()
        recipe["stars"] = Number(stars);
        updates[`${DB_RECIPES}/${recipeID}`] = recipe;
        update(ref(db), updates);
    }

    const addCommentToRecipe = (comment) => {
        const recipeID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, DB_RECIPE_COMMENTS), recipeID);
        push(dbref, comment);
    }

    const addLinkToRecipe = (link) => {
        const recipeID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, DB_RECIPE_LINKS), recipeID);
        push(dbref, link);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName='edit'
                        text={showEditRecipe ? t('button_close') : ''}
                        color={showEditRecipe ? 'red' : 'orange'}
                        onClick={() => setShowEditRecipe(!showEditRecipe)} />
                    <Button
                        iconName='plus'
                        secondIconName='carrot'
                        color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : ''}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    <Button
                        iconName='plus'
                        secondIconName='hourglass-1'
                        color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : ''}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
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
            {/* Accordion end */}
            <div className="page-content">

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

                <SetStarRating starCount={recipe.stars} onSaveStars={saveStars} />
                <AddComment onSave={addCommentToRecipe} />
                <AddLink onSaveLink={addLinkToRecipe} />
                {/* <pre>{JSON.stringify(recipe)}</pre> */}
                {showEditRecipe && <AddRecipe onClose={() => setShowEditRecipe(false)} onAddRecipe={addRecipe} recipeID={params.id} />}
                {showAddIncredient && <AddIncredient onAddIncredient={addIncredient} recipeID={params.id} />}
                {showAddWorkPhase && <AddWorkPhase onAddWorkPhase={addWorkPhase} recipeID={params.id} />}
                {incredients != null}
                {incredients != null && incredients.length > 0 ? (
                    <Incredients
                        recipeID={params.id}
                        incredients={incredients}
                        onDelete={deleteIncredient}
                    />
                ) : (
                    <p> {t('no_incredients_to_show')} </p>
                )}
                {workPhases != null}
                {workPhases != null && workPhases.length > 0 ? (
                    <WorkPhases
                        recipeID={params.id}
                        workPhases={workPhases}
                        onDeleteWorkPhase={deleteWorkPhase}
                    />
                ) : (
                    <p> {t('no_workphases_to_show')} </p>
                )}
                <Comments objID={params.id} url={'recipe-comments'} />
                <Links objID={params.id} url={'recipe-links'} />
            </div>
        </div>
    )
}
