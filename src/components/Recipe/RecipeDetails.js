//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Row, ButtonGroup } from 'react-bootstrap';
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

export default function RecipeDetails() {

    //states
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState({})
    const [showEditRecipe, setShowEditRecipe] = useState(false)
    const [showAddIncredient, setShowAddIncredient] = useState(false)
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false)
    const [incredients, setIncredients] = useState()
    const [workPhases, setWorkPhases] = useState()

    const { t } = useTranslation('recipe', { keyPrefix: 'recipe' });
    const params = useParams();
    const navigate = useNavigate();

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
        const dbref = ref(db, '/recipes/' + params.id);
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
        const dbref = ref(db, '/incredients/' + recipeID + "/" + id)
        remove(dbref)
    }

    /** Add Work Phase To Firebase */
    const addWorkPhase = async (recipeID, workPhase) => {
        const dbref = child(ref(db, '/workphases'), recipeID);
        push(dbref, workPhase);
    }

    /** Delete Work Phase From Firebase */
    const deleteWorkPhase = async (recipeID, id) => {
        const dbref = ref(db, '/workphases/' + recipeID + "/" + id);
        remove(dbref);
    }

    /** Add Recipe To Firebase */
    const addRecipe = async (recipe) => {
        var recipeID = params.id;
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
        var recipeID = params.id;
        //save edited drink to firebase
        const updates = {};
        recipe["modified"] = getCurrentDateAsJson()
        recipe["stars"] = Number(stars);
        updates[`/recipes/${recipeID}`] = recipe;
        update(ref(db), updates);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button text={showEditRecipe ? t('button_close') : t('button_edit')}
                        color={showEditRecipe ? 'red' : 'orange'}
                        onClick={() => setShowEditRecipe(!showEditRecipe)} />
                    <Button color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : t('button_add_incredient')}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    <Button color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : t('button_add_workphase')}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                </ButtonGroup>
            </Row>
            <h4 className="page-title">
                <FaUtensils style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} /> {recipe.title}
                <SetStarRating starCount={recipe.stars} onSaveStars={saveStars} />
            </h4>
            <div className="page-content">
                {/* <pre>{JSON.stringify(recipe)}</pre> */}
                <p>{recipe.description}</p>
                <p>
                    {t('created')}: {getJsonAsDateTimeString(recipe.created, i18n.language)}<br />
                    {t('created_by')}: {recipe.createdBy}<br />
                    {t('category')}: {recipe.category}<br />
                    {t('modified')}: {getJsonAsDateTimeString(recipe.modified, i18n.language)}<br />
                    {t('core_recipe')}: {recipe.isCore === true ? t('yes') : t('no')}
                </p>
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
            </div>
        </div>
    )
}
