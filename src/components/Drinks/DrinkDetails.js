import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Accordion, Table, Row, ButtonGroup, Col, Tabs, Tab } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { ref, child, onValue } from 'firebase/database';
import Button from '../../components/Button';
import GoBackButton from '../../components/GoBackButton';
import i18n from "i18next";
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getDrinkCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import AddDrink from './AddDrink';
import AddGarnish from './AddGarnish';
import AddWorkPhase from '../Recipe/AddWorkPhase';
import Garnishes from './Garnishes';
import AddIncredient from '../Recipe/AddIncredient';
import WorkPhases from '../Recipe/WorkPhases';
import Incredients from '../Recipe/Incredients';
import RecipeHistories from '../Recipe/RecipeHistories';
import SetStarRating from '../StarRating/SetStarRating';
import StarRating from '../StarRating/StarRating';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../PageTitle';
import Alert from '../Alert';
import PageContentWrapper from '../PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById } from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import ImageComponent from '../ImageUpload/ImageComponent';

export default function DrinkDetails() {

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
    const { t } = useTranslation(Constants.TRANSLATION_DRINKS, { keyPrefix: Constants.TRANSLATION_DRINKS });

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
        const dbref = await child(ref(db, Constants.DB_DRINK_WORKPHASES), params.id);
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
        const dbref = await child(ref(db, Constants.DB_DRINK_GARNISHES), params.id);
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
        const dbref = await child(ref(db, Constants.DB_DRINK_HISTORY), params.id);
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
        const dbref = ref(db, `${Constants.DB_DRINKS}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setDrink(data);
            setLoading(false);
        })
    }

    const updateDrink = async (drinkToUpdate) => {
        try {
            var drinkID = params.id;
            drinkToUpdate["modified"] = getCurrentDateAsJson();
            if (drinkToUpdate["isCore"] === undefined) {
                drinkToUpdate["isCore"] = false;
            }
            updateToFirebaseById(Constants.DB_DRINKS, drinkID, drinkToUpdate);
        } catch (error) {
            setError(t('failed_to_save_drink'));
            setShowError(true);
            console.log(error)
        }
    }

    const updateDrinkIncredients = async () => {
        var drinkID = params.id;
        drink["incredients"] = getIncredientsAsText();
        updateToFirebaseById(Constants.DB_DRINKS, drinkID, drink);
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

    const fetchIncredientsFromFirebase = async () => {
        const dbref = await child(ref(db, Constants.DB_DRINK_INCREDIENTS), params.id);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            for (let id in snap) {
                fromDB.push({ id, ...snap[id] });
            }
            setIncredients(fromDB);
        })
    }

    const deleteIncredient = async (drinkID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_DRINK_INCREDIENTS, drinkID, id);
    }

    const deleteWorkPhase = async (drinkID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_DRINK_WORKPHASES, drinkID, id);
    }

    const deleteGarnish = async (drinkID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_DRINK_GARNISHES, drinkID, id);
    }

    const saveStars = async (stars) => {
        const drinkID = params.id;
        drink["modified"] = getCurrentDateAsJson()
        drink["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_DRINKS, drinkID, drink);
    }

    const addCommentToDrink = (comment) => {
        const drinkID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_DRINK_COMMENTS, drinkID, comment);
    }

    const addLinkToDrink = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_DRINK_LINKS, drinkID, link);
    }

    const addIncredient = async (drinkID, incredient) => {
        await pushToFirebaseChild(Constants.DB_DRINK_INCREDIENTS, drinkID, incredient);
    }

    const addWorkPhase = async (drinkID, workPhase) => {
        pushToFirebaseChild(Constants.DB_DRINK_WORKPHASES, drinkID, workPhase);
    }

    const addGarnish = async (drinkID, garnish) => {
        pushToFirebaseChild(Constants.DB_DRINK_GARNISHES, drinkID, garnish);
    }

    const saveDrinkHistory = async (drinkID) => {
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;
        pushToFirebaseById(Constants.DB_DRINK_HISTORY, drinkID, { currentDateTime, userID });
        setShowMessage(true);
        setMessage(t('save_success_drinkinghistory'));
    }

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
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
                                <PageTitle title={drink.title} iconName={Constants.ICON_GLASS_MARTINI} iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
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
                    {t('description') + ': '}{drink.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    {t('incredients') + ': '}{drink.incredients}
                </Col>
            </Row>
            <Row>
                <Col>
                    <StarRating starCount={drink.stars} />
                </Col>
            </Row>
            {/* {<pre>{JSON.stringify(drinkHistory)}</pre>} */}

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

            {showEditDrink &&
                <AddDrink onSave={updateDrink} drinkID={params.id} onClose={() => setShowEditDrink(false)} />
            }

            <Tabs defaultActiveKey="incredients"
                id="drinkDetails-Tab"
                className="mb-3">
                <Tab eventKey="incredients" title={t('incredients_header')}>
                    <Button
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_CARROT}
                        color={showAddIncredient ? 'red' : 'green'}
                        text={showAddIncredient ? t('button_close') : ''}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    {showAddIncredient &&
                        <AddIncredient
                            dbUrl={Constants.DB_DRINK_INCREDIENTS}
                            translation={Constants.TRANSLATION_DRINKS}
                            recipeID={params.id}
                            onSave={addIncredient}
                            onClose={() => setShowAddIncredient(false)} />
                    }
                    {incredients != null && incredients.length > 0 ? (
                        <>
                            <Button iconName={Constants.ICON_SYNC} onClick={updateDrinkIncredients} />
                            <Incredients
                                dbUrl={Constants.DB_DRINK_INCREDIENTS}
                                translation={Constants.TRANSLATION_DRINKS}
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
                        color={showAddWorkPhase ? 'red' : 'green'}
                        text={showAddWorkPhase ? t('button_close') : ''}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                    {showAddWorkPhase && <AddWorkPhase
                        dbUrl={Constants.DB_DRINK_WORKPHASES}
                        translation={Constants.TRANSLATION_DRINKS}
                        recipeID={params.id}
                        onSave={addWorkPhase} onClose={() => setShowAddWorkPhase(false)} />}
                    {workPhases != null && workPhases.length > 0 ? (
                        <WorkPhases
                            dbUrl={Constants.DB_DRINK_WORKPHASES}
                            translation={Constants.TRANSLATION_DRINKS}
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
                <Tab eventKey="garnishes" title={t('garnishes_header')}>
                    <Button
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_LEMON}
                        color={showAddGarnish ? 'red' : 'green'}
                        text={showAddGarnish ? t('button_close') : ''}
                        onClick={() => setShowAddGarnish(!showAddGarnish)} />
                    {showAddGarnish &&
                        <AddGarnish
                            drinkID={params.id} onSave={addGarnish} onClose={() => setShowAddGarnish(false)} />
                    }
                    {garnishes != null && garnishes.length > 0 ? (
                        <Garnishes
                            drinkID={params.id}
                            garnishes={garnishes}
                            onDelete={deleteGarnish}
                        />
                    ) : (
                        <>
                            <CenterWrapper>
                                {t('no_garnishes_to_show')}
                            </CenterWrapper>
                        </>
                    )}
                </Tab>
                <Tab eventKey="actions" title={t('tabheader_actions')}>
                    <>
                        <SetStarRating starCount={drink.stars} onSaveStars={saveStars} />
                        &nbsp;
                        <Button
                            iconName={Constants.ICON_PLUS_SQUARE}
                            text={t('do_drink')}
                            onClick={() => { if (window.confirm(t('do_drink_confirm'))) { saveDrinkHistory(params.id); } }}
                        />
                    </>
                </Tab>
            </Tabs>
            <hr />
            {
                drinkHistory != null && drinkHistory.length > 0 ? (
                    <RecipeHistories
                        dbUrl={Constants.DB_DRINK_HISTORY}
                        translation={Constants.TRANSLATION_DRINKS}
                        recipeHistories={drinkHistory}
                        recipeID={params.id} />
                ) : (
                    <>
                        <CenterWrapper>
                            {t('no_drink_history')}
                        </CenterWrapper>
                    </>
                )
            }
            <ImageComponent objID={params.id} url={Constants.DB_DRINK_IMAGES} />
            <CommentComponent objID={params.id} url={Constants.DB_DRINK_COMMENTS} onSave={addCommentToDrink} />
            <LinkComponent objID={params.id} url={Constants.DB_DRINK_LINKS} onSaveLink={addLinkToDrink} />
        </PageContentWrapper>
    )
}
