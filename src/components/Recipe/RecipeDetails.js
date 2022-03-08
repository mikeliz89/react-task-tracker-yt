import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";
import GoBackButton from '../GoBackButton';
import { Row, ButtonGroup } from 'react-bootstrap'
import AddIncredient from './AddIncredient'
import { push, child, remove } from "firebase/database";
import Button from '../../components/Button'
import Incredients from './Incredients';

export default function RecipeDetails() {

    //states
    const [loading, setLoading] = useState(true)
    const [recipe, setRecipe] = useState({})
    const [showAddIncredient, setShowAddIncredient] = useState(false)
    const [incredients, setIncredients] = useState()

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
            </ButtonGroup>
        </Row>
        <h4 className="page-title">{recipe.title}</h4>
        <div className="page-content">
            {/* <pre>{JSON.stringify(recipe)}</pre> */}
            <p>{recipe.description}</p>
            {showAddIncredient && <AddIncredient onAddIncredient={addIncredient} recipeID={params.id} />}
            {incredients != null}

            {incredients != null && incredients.length > 0 ? (
            <Incredients
            recipeID={params.id}
            incredients={incredients}
            onDelete={deleteIncredient}
                />
            ) : (
                t('no_incredients_to_show')
            )}
        </div>
    </div>
    )
}
