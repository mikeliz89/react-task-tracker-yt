import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import GoBackButton from '../GoBackButton';
import { Row, ButtonGroup } from 'react-bootstrap'
import AddIncredient from './AddIncredient'
import AddWorkPhase from './AddWorkPhase'
import { push, child, remove } from "firebase/database";
import Button from '../../components/Button'
import Incredients from './Incredients';
import WorkPhases from './WorkPhases';
import i18n from "i18next";
import { getJsonAsDateTimeString } from '../../utils/DateTimeUtils'

export default function RecipeDetails() {

    //states
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState({})
    const [showAddIncredient, setShowAddIncredient] = useState(false)
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false)
    const [incredients, setIncredients] = useState()
    const [workPhases, setWorkPhases] = useState()

    const { t } = useTranslation();
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
            if(data === null) {
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
          for(let id in snap) {
            incredients.push({id, ...snap[id]});
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
            for(let id in snap) {
                workphases.push({id, ...snap[id]});
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
    const deleteIncredient = async(recipeID, id) => {
        const dbref = ref(db, '/incredients/' + recipeID + "/" + id)
        remove(dbref)
    }

    /** Add Work Phase To Firebase */
    const addWorkPhase = async(recipeID, workPhase) => {
        const dbref = child(ref(db, '/workphases'), recipeID);
        push(dbref, workPhase);
    }

    /** Delete Work Phase From Firebase */
    const deleteWorkPhase = async(recipeID, id) => {
        const dbref = ref(db, '/workphases/' + recipeID + "/" + id);
        remove(dbref);
    }

    return loading ? (
    <h3>{t('loading')}</h3>
    ) : ( 
    <div>
        <Row>
            <ButtonGroup>
                <GoBackButton />
                <Button color={showAddIncredient ? 'red' : 'green'}
                  text={showAddIncredient ? t('button_close') : t('button_add_incredient')}
                  onClick={() => setShowAddIncredient(!showAddIncredient)} />
                <Button color={showAddWorkPhase ? 'red' : 'green'}
                  text={showAddWorkPhase ? t('button_close') : t('button_add_workphase')}
                  onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
            </ButtonGroup>
        </Row>
        <h4 className="page-title">{recipe.title}</h4>
        <div className="page-content">
            {/* <pre>{JSON.stringify(recipe)}</pre> */}
            <p>{recipe.description}</p>
            <p>
                {t('created')}: {getJsonAsDateTimeString(recipe.created, i18n.language)}<br/>
                {t('created_by')}: {recipe.createdBy}<br/>
                {t('category')}: {recipe.category}
            </p>
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
               <p> { t('no_incredients_to_show') } </p>
            )}

            {workPhases != null}
            {workPhases != null && workPhases.length > 0 ? (
            <WorkPhases
            recipeID={params.id}
            workPhases={workPhases}
            onDeleteWorkPhase={deleteWorkPhase}
                />
            ) : (
                <p> { t('no_workphases_to_show') } </p>
            )}
        </div>
    </div>
    )
}
