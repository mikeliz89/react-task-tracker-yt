//react
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col, Tabs, Tab } from 'react-bootstrap';
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
import AddGarnish from './AddGarnish';
import AddWorkPhase from '../Recipe/AddWorkPhase';
import Garnishes from './Garnishes';
//recipe
import AddIncredient from '../Recipe/AddIncredient';
import WorkPhases from '../Recipe/WorkPhases';
import Incredients from '../Recipe/Incredients';
import RecipeHistories from '../Recipe/RecipeHistories';
//StarRating
import SetStarRating from '../StarRating/SetStarRating';
import StarRating from '../StarRating/StarRating';
//Comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//auth
import { useAuth } from '../../contexts/AuthContext';
//pagetitle
import PageTitle from '../PageTitle';
//alert
import Alert from '../Alert';

export default function DrinkDetails() {

    //constants
    const DB_DRINKS = '/drinks';
    const DB_DRINK_GARNISHES = '/drink-garnishes';
    const DB_DRINK_INCREDIENTS = '/drink-incredients';
    const DB_DRINK_WORKPHASES = '/drink-workphases';
    const DB_DRINK_COMMENTS = '/drink-comments';
    const DB_DRINK_LINKS = '/drink-links';
    const DB_DRINK_HISTORY = '/drinkhistory';
    const TRANSLATION = 'drinks';

    //states
    const [loading, setLoading] = useState(true);
    const [drink, setDrink] = useState({});
    const [drinkHistory, setDrinkHistory] = useState({});
    const [showAddIncredient, setShowAddIncredient] = useState(false);
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false);
    const [showAddGarnish, setShowAddGarnish] = useState(false);
    const [showEditDrink, setShowEditDrink] = useState(false);
    const [incredients, setIncredients] = useState({});
    const [workPhases, setWorkPhases] = useState({});
    const [garnishes, setGarnishes] = useState({});

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation(TRANSLATION, { keyPrefix: TRANSLATION });

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
        getDrink();
        const getIncredients = async () => {
            await fetchIncredientsFromFirebase();
        }
        getIncredients();
        const getWorkPhases = async () => {
            await fetchWorkPhasesFromFirebase();
        }
        getWorkPhases();
        const getDrinkHistory = async () => {
            await fetchDrinkHistoryFromFirebase();
        }
        getDrinkHistory();
        const getGarnishes = async () => {
            await fetchGarnishesFromFirebase();
        }
        getGarnishes();
    }, [])

    const fetchWorkPhasesFromFirebase = async () => {
        const dbref = await child(ref(db, DB_DRINK_WORKPHASES), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setWorkPhases(fromDB);
        })
    }

    const fetchGarnishesFromFirebase = async () => {
        const dbref = await child(ref(db, DB_DRINK_GARNISHES), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setGarnishes(fromDB);
        })
    }

    const fetchDrinkHistoryFromFirebase = async () => {
        const dbref = await child(ref(db, DB_DRINK_HISTORY), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setDrinkHistory(fromDB);
        })
    }

    const fetchDrinkFromFirebase = async () => {
        const dbref = ref(db, `${DB_DRINKS}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setDrink(data);
            setLoading(false);
        })
    }

    const addDrink = async (drink) => {
        try {
            var drinkID = params.id;
            //save edited drink to firebase
            const updates = {};
            drink["modified"] = getCurrentDateAsJson();
            if (drink["glass"] === undefined) {
                drink["glass"] = '';
            }
            if (drink["stars"] === undefined) {
                drink["stars"] = 0;
            }
            updates[`${DB_DRINKS}/${drinkID}`] = drink;
            update(ref(db), updates);
        } catch (error) {
            setError(t('failed_to_save_drink'));
            setShowError(true);
            console.log(error)
        }
    }

    const fetchIncredientsFromFirebase = async () => {
        const dbref = await child(ref(db, DB_DRINK_INCREDIENTS), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const incredients = [];
            for (let id in snap) {
                incredients.push({ id, ...snap[id] });
            }
            setIncredients(incredients);
        })
    }

    const deleteIncredient = async (drinkID, id) => {
        const dbref = ref(db, `${DB_DRINK_INCREDIENTS}/${drinkID}/${id}`);
        remove(dbref);
    }

    const addIncredient = async (drinkID, incredient) => {
        const dbref = child(ref(db, DB_DRINK_INCREDIENTS), drinkID);
        push(dbref, incredient);
    }

    const saveStars = async (stars) => {
        const drinkID = params.id;
        //save edited drink to firebase
        const updates = {};
        drink["modified"] = getCurrentDateAsJson()
        drink["stars"] = Number(stars);
        updates[`${DB_DRINKS}/${drinkID}`] = drink;
        update(ref(db), updates);
    }

    const addCommentToDrink = (comment) => {
        const drinkID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, DB_DRINK_COMMENTS), drinkID);
        push(dbref, comment);
    }

    const addLinkToDrink = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, DB_DRINK_LINKS), drinkID);
        push(dbref, link);
    }

    const addWorkPhase = async (drinkID, workPhase) => {
        const dbref = child(ref(db, DB_DRINK_WORKPHASES), drinkID);
        push(dbref, workPhase);
    }

    const addGarnish = async (drinkID, garnish) => {
        const dbref = child(ref(db, DB_DRINK_GARNISHES), drinkID);
        push(dbref, garnish);
    }

    const deleteWorkPhase = async (drinkID, id) => {
        const dbref = ref(db, `${DB_DRINK_WORKPHASES}/${drinkID}/${id}`);
        remove(dbref);
    }

    const deleteGarnish = async (drinkID, id) => {
        const dbref = ref(db, `${DB_DRINK_GARNISHES}/${drinkID}/${id}`);
        remove(dbref);
    }

    const saveDrinkHistory = async (drinkID) => {
        const dbref = ref(db, `${DB_DRINK_HISTORY}/${drinkID}`);
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;
        push(dbref, { currentDateTime, userID });

        setShowMessage(true);
        setMessage(t('save_success_drinkinghistory'));
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
                        text={showEditDrink ? t('button_close') : ''}
                        color={showEditDrink ? 'red' : 'orange'}
                        onClick={() => setShowEditDrink(!showEditDrink)} />
                </ButtonGroup>
            </Row>
            <Row>
                <Col>
                    <Accordion>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>
                                <PageTitle title={drink.title} iconName='glass-martini' iconColor='gray' />
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
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRating starCount={drink.stars} />
                </Col>
            </Row>
            <div className="page-content">
                {/* {<pre>{JSON.stringify(drinkHistory)}</pre>} */}

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

                {showEditDrink && <AddDrink onAddDrink={addDrink} drinkID={params.id} onClose={() => setShowEditDrink(false)} />}

                <Tabs defaultActiveKey="incredients"
                    id="drinkDetails-Tab"
                    className="mb-3">
                    <Tab eventKey="incredients" title={t('incredients_header')}>
                        <Button
                            iconName='plus'
                            secondIconName='carrot'
                            color={showAddIncredient ? 'red' : 'green'}
                            text={showAddIncredient ? t('button_close') : ''}
                            onClick={() => setShowAddIncredient(!showAddIncredient)} />
                        {showAddIncredient &&
                            <AddIncredient
                                dbUrl={DB_DRINK_INCREDIENTS}
                                translation={TRANSLATION}
                                recipeID={params.id}
                                onSave={addIncredient}
                                onClose={() => setShowAddIncredient(false)} />
                        }
                        {incredients != null && incredients.length > 0 ? (
                            <Incredients
                                dbUrl={DB_DRINK_INCREDIENTS}
                                translation={TRANSLATION}
                                recipeID={params.id}
                                incredients={incredients}
                                onDelete={deleteIncredient}
                            />
                        ) : (
                            <p> {t('no_incredients_to_show')} </p>
                        )}
                    </Tab>
                    <Tab eventKey="workPhases" title={t('workphases_header')}>
                        <Button
                            iconName='plus'
                            secondIconName='hourglass-1'
                            color={showAddWorkPhase ? 'red' : 'green'}
                            text={showAddWorkPhase ? t('button_close') : ''}
                            onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                        {showAddWorkPhase && <AddWorkPhase
                            dbUrl={DB_DRINK_WORKPHASES}
                            translation={TRANSLATION}
                            recipeID={params.id}
                            onSave={addWorkPhase} onClose={() => setShowAddWorkPhase(false)} />}
                        {workPhases != null && workPhases.length > 0 ? (
                            <WorkPhases
                                dbUrl={DB_DRINK_WORKPHASES}
                                translation={TRANSLATION}
                                recipeID={params.id}
                                workPhases={workPhases}
                                onDelete={deleteWorkPhase}
                            />
                        ) : (
                            <p> {t('no_workphases_to_show')} </p>
                        )}
                    </Tab>
                    <Tab eventKey="garnishes" title={t('garnishes_header')}>
                        <Button
                            iconName='plus'
                            secondIconName='lemon'
                            color={showAddGarnish ? 'red' : 'green'}
                            text={showAddGarnish ? t('button_close') : ''}
                            onClick={() => setShowAddGarnish(!showAddGarnish)} />
                        {showAddGarnish && <AddGarnish drinkID={params.id} onAddGarnish={addGarnish} onClose={() => setShowAddGarnish(false)} />}
                        {garnishes != null && garnishes.length > 0 ? (
                            <Garnishes
                                drinkID={params.id}
                                garnishes={garnishes}
                                onDelete={deleteGarnish}
                            />
                        ) : (
                            <p> {t('no_garnishes_to_show')} </p>
                        )}
                    </Tab>
                    <Tab eventKey="actions" title="Toiminnot">
                        <SetStarRating starCount={drink.stars} onSaveStars={saveStars} />
                        <AddComment onSave={addCommentToDrink} />
                        <AddLink onSaveLink={addLinkToDrink} />
                        <Button
                            iconName='plus-square'
                            text={t('do_drink')}
                            onClick={() => { if (window.confirm(t('do_drink_confirm'))) { saveDrinkHistory(params.id); } }}
                        />
                    </Tab>
                </Tabs>
                <hr />
                {
                    drinkHistory != null && drinkHistory.length > 0 ? (
                        <RecipeHistories
                            dbUrl={DB_DRINK_HISTORY}
                            translation={TRANSLATION}
                            recipeHistories={drinkHistory}
                            recipeID={params.id} />
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
