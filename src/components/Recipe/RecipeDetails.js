//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup, Accordion, Table } from 'react-bootstrap';
import { FaUtensils } from 'react-icons/fa';
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

export default function RecipeDetails() {

    //states
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState({})
    const [showEditRecipe, setShowEditRecipe] = useState(false)
    const [showAddIncredient, setShowAddIncredient] = useState(false)
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false)
    const [incredients, setIncredients] = useState()
    const [workPhases, setWorkPhases] = useState()

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
        const dbref = ref(db, `/recipes/${params.id}`);
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
        const dbref = await child(ref(db, '/incredients'), params.id);
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
        const dbref = await child(ref(db, '/workphases'), params.id);
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
        const dbref = child(ref(db, '/incredients'), recipeID);
        push(dbref, incredient);
    }

    /** Delete Incredient From Firebase */
    const deleteIncredient = async (recipeID, id) => {
        const dbref = ref(db, `/incredients/${recipeID}/${id}`);
        remove(dbref)
    }

    /** Add Work Phase To Firebase */
    const addWorkPhase = async (recipeID, workPhase) => {
        const dbref = child(ref(db, '/workphases'), recipeID);
        push(dbref, workPhase);
    }

    /** Delete Work Phase From Firebase */
    const deleteWorkPhase = async (recipeID, id) => {
        const dbref = ref(db, `/workphases/${recipeID}/${id}`);
        remove(dbref);
    }

    /** Add Recipe To Firebase */
    const addRecipe = async (recipe) => {
        const recipeID = params.id;
        //save edited recipe to firebase
        const updates = {};
        if (recipe["category"] === t('category_none')) {
            recipe["category"] = '';
        }
        recipe["modified"] = getCurrentDateAsJson()
        updates[`/recipes/${recipeID}`] = recipe;
        update(ref(db), updates);
    }

    const saveStars = async (stars) => {
        const recipeID = params.id;
        //save edited recipe to firebase
        const updates = {};
        recipe["modified"] = getCurrentDateAsJson()
        recipe["stars"] = Number(stars);
        updates[`/recipes/${recipeID}`] = recipe;
        update(ref(db), updates);
    }

    const addCommentToRecipe = (comment) => {
        const recipeID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, '/recipe-comments'), recipeID);
        push(dbref, comment);
    }

    const addLinkToRecipe = (link) => {
        const recipeID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, '/recipe-links'), recipeID);
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
                        showIconEdit={true}
                        text={showEditRecipe ? t('button_close') : ''}
                        color={showEditRecipe ? 'red' : 'orange'}
                        onClick={() => setShowEditRecipe(!showEditRecipe)} />
                    <Button
                        showIconAdd={true}
                        showIconCarrot={true}
                        color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : ''}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    <Button
                        showIconAdd={true}
                        showIconHourGlass={true}
                        color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : ''}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                </ButtonGroup>
            </Row>
            {/* Accordion start */}
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h3 className="page-title">
                            <FaUtensils style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} /> {recipe.title}
                        </h3>
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
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {/* Accordion end */}
            <div className="page-content">
                <SetStarRating starCount={recipe.stars} onSaveStars={saveStars} />
                <AddComment onSave={addCommentToRecipe} />
                <AddLink onSaveLink={addLinkToRecipe} />
                {/* <pre>{JSON.stringify(recipe)}</pre> */}
                {showEditRecipe && <AddRecipe onAddRecipe={addRecipe} recipeID={params.id} />}
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
