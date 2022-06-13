//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Row, ButtonGroup } from 'react-bootstrap';
import { FaGlassMartini } from 'react-icons/fa';
//firebase
import { db } from '../../firebase-config';
import { push, ref, child, onValue, update, remove } from "firebase/database";
//buttons
import Button from '../../components/Button';
import GoBackButton from '../../components/GoBackButton';
//i18n
import i18n from "i18next";
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
//Drinks
import AddDrink from './AddDrink';
import AddIncredient from './AddIncredient';
import DrinkHistories from './DrinkHistories';
import Incredients from './Incredients';
import EditIncredient from './EditIncredient';
//StarRating
import SetStarRating from '../StarRating/SetStarRating';

export default function DrinkDetails() {

    //states
    const [loading, setLoading] = useState(true);
    const [drink, setDrink] = useState({});
    const [drinkHistory, setDrinkHistory] = useState({});
    const [showAddIncredient, setShowAddIncredient] = useState(false);
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false);
    const [showEditDrink, setShowEditDrink] = useState(false);
    const [incredients, setIncredients] = useState({});

    //translation
    const { t } = useTranslation('drinks', { keyPrefix: 'drinks' });

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //load data
    useEffect(() => {
        const getDrink = async () => {
            await fetchDrinkFromFirebase();
        }
        getDrink()
        const getIncredients = async () => {
            await fetchIncredientsFromFirebase()
        }
        getIncredients()
        const getDrinkHistory = async () => {
            await fetchDrinkHistoryFromFirebase();
        }
        getDrinkHistory()
    }, [])

    const fetchDrinkHistoryFromFirebase = async () => {
        const dbref = await child(ref(db, '/drinkhistory'), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setDrinkHistory(fromDB);
        })
    }

    /** Fetch Drink From Firebase */
    const fetchDrinkFromFirebase = async () => {
        const dbref = ref(db, '/drinks/' + params.id);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1)
            }
            setDrink(data)
            setLoading(false);
        })
    }

    /** Add Drink To Firebase */
    const addDrink = async (drink) => {
        var drinkID = params.id;
        //save edited drink to firebase
        const updates = {};
        drink["modified"] = getCurrentDateAsJson()
        updates[`/drinks/${drinkID}`] = drink;
        update(ref(db), updates);
    }

    /** Fetch Incredients From Firebase */
    const fetchIncredientsFromFirebase = async () => {
        const dbref = await child(ref(db, '/drink-incredients'), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const incredients = [];
            for (let id in snap) {
                incredients.push({ id, ...snap[id] });
            }
            setIncredients(incredients);
        })
    }

    /** Delete Incredient From Firebase */
    const deleteIncredient = async (drinkID, id) => {
        const dbref = ref(db, '/drink-incredients/' + drinkID + "/" + id)
        remove(dbref)
    }

    /** Add Incredient To Firebase */
    const addIncredient = async (drinkID, incredient) => {
        const dbref = child(ref(db, '/drink-incredients'), drinkID);
        push(dbref, incredient);
    }

    const saveStars = async (stars) => {
        var drinkID = params.id;
        //save edited drink to firebase
        const updates = {};
        drink["modified"] = getCurrentDateAsJson()
        drink["stars"] = Number(stars);
        updates[`/drinks/${drinkID}`] = drink;
        update(ref(db), updates);
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <div>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button text={showEditDrink ? t('button_close') : t('button_edit')}
                        color={showEditDrink ? 'red' : 'orange'}
                        onClick={() => setShowEditDrink(!showEditDrink)} />
                    <Button color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : t('button_add_incredient')}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    <Button color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : t('button_add_workphase')}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                </ButtonGroup>
            </Row>
            <h4 className="page-title">
                <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} /> {drink.title}
                <SetStarRating starCount={drink.stars} onSaveStars={saveStars} />
            </h4>
            <div className="page-content">
                {/* {<pre>{JSON.stringify(drinkHistory)}</pre>} */}
                <p>{drink.description}</p>
                <p>
                    {t('created')}: {getJsonAsDateTimeString(drink.created, i18n.language)}<br />
                    {t('created_by')}: {drink.createdBy}<br />
                    {t('modified')}: {getJsonAsDateTimeString(drink.modified, i18n.language)}<br />
                    {t('category')}: {drink.category}<br />
                    {t('glass')}: {drink.glass}
                </p>
                {showEditDrink && <AddDrink onAddDrink={addDrink} drinkID={params.id} />}
                {showAddIncredient && <AddIncredient drinkID={params.id} onAddIncredient={addIncredient} />}
                {incredients != null}
                {incredients != null && incredients.length > 0 ? (
                    <Incredients
                        drinkID={params.id}
                        incredients={incredients}
                        onDelete={deleteIncredient}
                    />
                ) : (
                    <p> {t('no_incredients_to_show')} </p>
                )}
                <h4>{t('drinkhistory_title')}</h4>
                {
                    drinkHistory != null && drinkHistory.length > 0 ? (
                        <DrinkHistories drinkHistories={drinkHistory} />
                    ) : (
                        t('no_drink_history')
                    )
                }
            </div>
        </div>
    )
}
