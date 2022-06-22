//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup } from 'react-bootstrap';
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
import { getDrinkCategoryNameByID } from '../../utils/ListUtils';
//Drinks
import AddDrink from './AddDrink';
import AddIncredient from './AddIncredient';
import DrinkHistories from './DrinkHistories';
import Incredients from './Incredients';
//StarRating
import SetStarRating from '../StarRating/SetStarRating';
//Comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//auth
import { useAuth } from '../../contexts/AuthContext';

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

    //auth
    const { currentUser } = useAuth();

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
        drink["modified"] = getCurrentDateAsJson();
        if (drink["glass"] === undefined) {
            drink["glass"] = '';
        }
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
        const drinkID = params.id;
        //save edited drink to firebase
        const updates = {};
        drink["modified"] = getCurrentDateAsJson()
        drink["stars"] = Number(stars);
        updates[`/drinks/${drinkID}`] = drink;
        update(ref(db), updates);
    }

    const addCommentToDrink = (comment) => {
        const drinkID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, '/drink-comments'), drinkID);
        push(dbref, comment);
    }

    const addLinkToDrink = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, '/drink-links'), drinkID);
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
                        text={showEditDrink ? t('button_close') : ''}
                        color={showEditDrink ? 'red' : 'orange'}
                        onClick={() => setShowEditDrink(!showEditDrink)} />
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
                            <FaGlassMartini style={{ color: 'gray', cursor: 'pointer', marginBottom: '3px' }} /> {drink.title}
                        </h3>
                    </Accordion.Header>
                    <Accordion.Body>
                        {t('description')}: {drink.description}<br />
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <td>{t('created')}</td>
                                    <td>{getJsonAsDateTimeString(drink.created, i18n.language)}</td>
                                </tr>
                                <tr>
                                    <td>{t('created_by')}</td>
                                    <td>{drink.createdBy}</td>
                                </tr>
                                <tr>
                                    <td>{t('modified')}</td>
                                    <td>{getJsonAsDateTimeString(drink.modified, i18n.language)}</td>
                                </tr>
                                <tr>
                                    <td>{t('glass')}</td>
                                    <td>{drink.glass}</td>
                                </tr>
                                <tr>
                                    <td>{t('category')}</td>
                                    <td>{t('category_' + getDrinkCategoryNameByID(drink.category))}</td>
                                </tr>
                            </tbody>
                        </Table>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            {/* Accordion end */}
            <div className="page-content">
                {/* {<pre>{JSON.stringify(drinkHistory)}</pre>} */}

                <SetStarRating starCount={drink.stars} onSaveStars={saveStars} />
                <AddComment onSave={addCommentToDrink} />
                <AddLink onSaveLink={addLinkToDrink} />

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

                <Comments objID={params.id} url={'drink-comments'} />
                <Links objID={params.id} url={'drink-links'} />
            </div>
        </div>
    )
}
