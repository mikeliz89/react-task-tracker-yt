import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Tab, Tabs, Col, Row, ButtonGroup, Accordion, Table } from 'react-bootstrap';
import { db } from '../../firebase-config';
import { child, ref, onValue } from 'firebase/database';
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddIncredient from './AddIncredient';
import AddWorkPhase from './AddWorkPhase';
import Incredients from './Incredients';
import WorkPhases from './WorkPhases';
import AddRecipe from './AddRecipe';
import i18n from "i18next";
import { getJsonAsDateTimeString, getCurrentDateAsJson } from '../../utils/DateTimeUtils';
import { getRecipeCategoryNameByID } from '../../utils/ListUtils';
import * as Constants from '../../utils/Constants';
import SetStarRating from '../StarRating/SetStarRating';
import { useAuth } from '../../contexts/AuthContext';
import PageTitle from '../Site/PageTitle';
import Alert from '../Alert';
import StarRating from '../StarRating/StarRating';
import RecipeHistories from './RecipeHistories';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById }
    from '../../datatier/datatier';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';

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

    const deleteIncredient = async (recipeID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_RECIPE_INCREDIENTS, recipeID, id);
    }

    const deleteWorkPhase = async (recipeID, id) => {
        removeFromFirebaseByIdAndSubId(Constants.DB_RECIPE_WORKPHASES, recipeID, id);
    }

    const addRecipe = async (recipe) => {
        try {
            const recipeID = params.id;
            recipe["modified"] = getCurrentDateAsJson();
            if (recipe["isCore"] === undefined) {
                recipe["isCore"] = false;
            }
            updateToFirebaseById(Constants.DB_RECIPES, recipeID, recipe);
        } catch (error) {
            console.log(error)
            setError(t('failed_to_save_recipe'));
            setShowError(true);
        }
    }

    const saveStars = async (stars) => {
        const recipeID = params.id;
        recipe["modified"] = getCurrentDateAsJson()
        recipe["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_RECIPES, recipeID, recipe);
    }

    const addIncredient = async (recipeID, incredient) => {
        pushToFirebaseChild(Constants.DB_RECIPE_INCREDIENTS, recipeID, incredient);
    }

    const addWorkPhase = async (recipeID, workPhase) => {
        pushToFirebaseChild(Constants.DB_RECIPE_WORKPHASES, recipeID, workPhase);
    }

    const addCommentToRecipe = (comment) => {
        const recipeID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_RECIPE_COMMENTS, recipeID, comment);
    }

    const addLinkToRecipe = (link) => {
        const recipeID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_RECIPE_LINKS, recipeID, link);
    }

    const saveRecipeHistory = async (recipeID) => {
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;

        pushToFirebaseById(Constants.DB_RECIPE_HISTORY, recipeID, { currentDateTime, userID });

        setShowMessage(true);
        setMessage(t('save_success_recipehistoryhistory'));
    }

    const updateRecipeIncredients = async () => {
        var recipeID = params.id;
        recipe["incredients"] = getIncredientsAsText();
        updateToFirebaseById(Constants.DB_RECIPES, recipeID, recipe);
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

    return loading ? (
        <h3>{t('loading')}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
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
                                <PageTitle title={recipe.title} iconName={Constants.ICON_UTENSILS} iconColor='gray' />
                            </Accordion.Header>
                            <Accordion.Body>
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
                    {t('description') + ': '} {recipe.description}
                </Col>
            </Row>
            <Row>
                <Col>
                    {t('incredients') + ': '} {recipe.incredients}
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
            {showEditRecipe &&
                <AddRecipe
                    onClose={() => setShowEditRecipe(false)} onSave={addRecipe} recipeID={params.id} />}

            <Tabs defaultActiveKey="home"
                id="recipeDetails-Tab"
                className="mb-3">
                <Tab eventKey="home" title={t('incredients_header')}>
                    <Button
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_CARROT}
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
                        <>
                            <Button iconName={Constants.ICON_SYNC} onClick={updateRecipeIncredients} />
                            <Incredients
                                dbUrl={Constants.DB_RECIPE_INCREDIENTS}
                                translation={Constants.TRANSLATION_RECIPE}
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
                <Tab eventKey="actions" title={t('tabheader_actions')}>
                    <>
                        <SetStarRating starCount={recipe.stars} onSaveStars={saveStars} />
                        &nbsp;
                        <Button
                            iconName={Constants.ICON_PLUS_SQUARE}
                            text={t('do_recipe')}
                            onClick={() => { if (window.confirm(t('do_recipe_confirm'))) { saveRecipeHistory(params.id); } }}
                        />
                    </>
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

            <ImageComponent objID={params.id} url={Constants.DB_RECIPE_IMAGES} />

            <CommentComponent objID={params.id} url={Constants.DB_RECIPE_COMMENTS} onSave={addCommentToRecipe} />

            <LinkComponent objID={params.id} url={Constants.DB_RECIPE_LINKS} onSaveLink={addLinkToRecipe} />

        </PageContentWrapper>
    )
}
