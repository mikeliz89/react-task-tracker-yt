import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col, Tabs, Tab, Modal } from 'react-bootstrap';
import { getIncredientsUrl } from '../Recipe/Categories';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
import i18n from "i18next";
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { getDrinkCategoryNameByID } from '../../utils/ListUtils';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';
import AddDrink from './AddDrink';
import AddGarnish from './AddGarnish';
import AddWorkPhase from '../Recipe/AddWorkPhase';
import Garnishes from './Garnishes';
import AddIncredient from '../Recipe/AddIncredient';
import WorkPhases from '../Recipe/WorkPhases';
import Incredients from '../Recipe/Incredients';
import RecipeHistories from '../Recipe/RecipeHistories';
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebase, pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById }
    from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import { useToggle } from '../Hooks/useToggle';
import useFetch from '../Hooks/useFetch';
import useFetchChildren from '../Hooks/useFetchChildren';
import { db } from '../../firebase-config';
import { ref, child, onValue } from 'firebase/database';
import { ListTypes, RecipeTypes } from '../../utils/Enums';


export default function DrinkDetails() {

    //navigate
    const navigate = useNavigate();

    //params
    const params = useParams();

    //states
    const [showAddIncredient, setShowAddIncredient] = useState(false);
    const [showAddWorkPhase, setShowAddWorkPhase] = useState(false);
    const [showAddGarnish, setShowAddGarnish] = useState(false);

    //modal
    const { status: showEditDrink, toggleStatus: toggleSetShowEditDrink } = useToggle();

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.DRINKS });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: drink, loading } = useFetch(DB.DRINKS, "", params.id);
    const { data: incredients } = useFetchChildren(DB.DRINK_INCREDIENTS, params.id);
    const { data: workPhases } = useFetchChildren(DB.DRINK_WORKPHASES, params.id);
    const { data: garnishes } = useFetchChildren(DB.DRINK_GARNISHES, params.id);
    const { data: drinkHistory } = useFetchChildren(DB.DRINK_HISTORY, params.id);

    const updateDrink = async (drinkToUpdate) => {
        try {
            var drinkID = params.id;
            drinkToUpdate["modified"] = getCurrentDateAsJson();
            if (drinkToUpdate["isCore"] === undefined) {
                drinkToUpdate["isCore"] = false;
            }
            updateToFirebaseById(DB.DRINKS, drinkID, drinkToUpdate);
            toggleSetShowEditDrink();
        } catch (error) {
            setError(t('failed_to_save_drink'));
            setShowError(true);
            console.log(error)
        }
    }

    const updateDrinkIncredients = async () => {
        var drinkID = params.id;
        drink["incredients"] = getIncredientsAsText();
        updateToFirebaseById(DB.DRINKS, drinkID, drink);
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

    const deleteIncredient = async (drinkID, id) => {
        removeFromFirebaseByIdAndSubId(DB.DRINK_INCREDIENTS, drinkID, id);
    }

    const deleteWorkPhase = async (drinkID, id) => {
        removeFromFirebaseByIdAndSubId(DB.DRINK_WORKPHASES, drinkID, id);
    }

    const deleteGarnish = async (drinkID, id) => {
        removeFromFirebaseByIdAndSubId(DB.DRINK_GARNISHES, drinkID, id);
    }

    const saveStars = async (stars) => {
        const drinkID = params.id;
        drink["modified"] = getCurrentDateAsJson()
        drink["stars"] = Number(stars);
        updateToFirebaseById(DB.DRINKS, drinkID, drink);
    }

    const addCommentToDrink = (comment) => {
        const drinkID = params.id;
        comment["created"] = getCurrentDateAsJson();
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.DRINK_COMMENTS, drinkID, comment);
    }

    const addLinkToDrink = (link) => {
        const drinkID = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.DRINK_LINKS, drinkID, link);
    }

    const addIncredient = async (drinkID, incredient) => {
        await pushToFirebaseChild(DB.DRINK_INCREDIENTS, drinkID, incredient);
    }

    const addWorkPhase = async (drinkID, workPhase) => {
        pushToFirebaseChild(DB.DRINK_WORKPHASES, drinkID, workPhase);
    }

    const addGarnish = async (drinkID, garnish) => {
        pushToFirebaseChild(DB.DRINK_GARNISHES, drinkID, garnish);
    }

    const saveDrinkHistory = async (drinkID) => {
        const currentDateTime = getCurrentDateAsJson();
        const userID = currentUser.uid;
        pushToFirebaseById(DB.DRINK_HISTORY, drinkID, { currentDateTime, userID });
        setShowMessage(true);
        setMessage(t('save_success_drinkinghistory'));
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(drink.created, i18n.language) },
            { id: 2, name: t('created_by'), value: drink.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(drink.modified, i18n.language) },
            { id: 4, name: t('glass'), value: drink.glass },
            { id: 5, name: t('category'), value: t('category_' + getDrinkCategoryNameByID(drink.category)) }
        ];
    }


    const makeShoppingList = async (drinkID) => {

        const incredients = await fetchIncredientsFromFirebase(drinkID);

        if (incredients && incredients.length > 0) {
            let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
            addTaskList({ title: `${t('shoppinglist')} ${currentDateTime}` }, incredients).then(() => {
                navigate(NAVIGATION.MANAGE_SHOPPINGLISTS)
            });
        } else if (incredients && incredients.length <= 0) {
            setError(t('shoppinglist_no_incredients'));
            setShowError(true);
        }
    }

    const fetchIncredientsFromFirebase = async (drinkID) => {
        console.log("drink ID ", drinkID);
        const incredients = [];
        const recipeType = RecipeTypes.Drink;
        const dbref = await child(ref(db, getIncredientsUrl(recipeType)), drinkID);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            for (let id in snap) {
                incredients.push({ id, ...snap[id] });
            }
        });
        return incredients;
    }

    const addTaskList = async (taskList, incredients) => {
        taskList["created"] = getCurrentDateAsJson();
        taskList["createdBy"] = currentUser.email;
        taskList["description"] = "";
        taskList["listType"] = ListTypes.Shopping;

        const key = await pushToFirebase(DB.TASKLISTS, taskList);
        addTasksToTaskList(key, incredients);
    }

    const addTasksToTaskList = async (tasklistID, incredients) => {
        //tee reseptin aineksista taskilistaan taskeja
        incredients.forEach(function (arrayItem) {
            let name = arrayItem.name;
            let amount = arrayItem.amount;
            let unit = arrayItem.unit;

            addTask(tasklistID, { text: name, 'day': amount + ' ' + unit, 'reminder': false });
        });
    }

    const addTask = async (taskListID, task) => {
        task["created"] = getCurrentDateAsJson()
        task["createdBy"] = currentUser.email;
        pushToFirebaseChild(DB.TASKS, taskListID, task);
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={ICONS.EDIT}
                        text={showEditDrink ? tCommon('buttons.button_close') : ''}
                        color={showEditDrink ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
                        onClick={() => toggleSetShowEditDrink()} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={drink.title} iconName={ICONS.GLASS_MARTINI} />

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
                    <StarRatingWrapper stars={drink.stars} onSaveStars={saveStars} />
                </Col>
            </Row>
            {/* {<pre>{JSON.stringify(drinkHistory)}</pre>} */}

            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={VARIANTS.SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Modal show={showEditDrink} onHide={toggleSetShowEditDrink}>
                <Modal.Header closeButton>
                    <Modal.Title>{t('modal_header_edit_drink')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddDrink onSave={updateDrink} drinkID={params.id}
                        onClose={() => toggleSetShowEditDrink()} />
                </Modal.Body>
            </Modal>

            <Tabs defaultActiveKey="incredients"
                id="drinkDetails-Tab"
                className="mb-3">
                <Tab eventKey="incredients" title={t('incredients_header')}>
                    <Button
                        iconName={ICONS.PLUS}
                        secondIconName={ICONS.CARROT}
                        color={showAddIncredient ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                        text={showAddIncredient ? tCommon('buttons.button_close') : ''}
                        onClick={() => setShowAddIncredient(!showAddIncredient)} />
                    {showAddIncredient &&
                        <AddIncredient
                            dbUrl={DB.DRINK_INCREDIENTS}
                            translation={TRANSLATION.TRANSLATION}
                            translationKeyPrefix={TRANSLATION.RECIPE}
                            recipeID={params.id}
                            onSave={addIncredient}
                            onClose={() => setShowAddIncredient(false)} />
                    }
                    {incredients != null && incredients.length > 0 ? (
                        <>
                            <Button iconName={ICONS.SYNC} onClick={updateDrinkIncredients} />
                            <Incredients
                                dbUrl={DB.DRINK_INCREDIENTS}
                                translation={TRANSLATION.TRANSLATION}
                                translationKeyPrefix={TRANSLATION.DRINKS}
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
                        iconName={ICONS.PLUS}
                        secondIconName={ICONS.HOURGLASS_1}
                        color={showAddWorkPhase ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                        text={showAddWorkPhase ? tCommon('buttons.button_close') : ''}
                        onClick={() => setShowAddWorkPhase(!showAddWorkPhase)} />
                    {showAddWorkPhase && <AddWorkPhase
                        dbUrl={DB.DRINK_WORKPHASES}
                        translation={TRANSLATION.TRANSLATION}
                        translationKeyPrefix={TRANSLATION.DRINKS}
                        recipeID={params.id}
                        onSave={addWorkPhase} onClose={() => setShowAddWorkPhase(false)} />}
                    {workPhases != null && workPhases.length > 0 ? (
                        <WorkPhases
                            dbUrl={DB.DRINK_WORKPHASES}
                            translation={TRANSLATION.TRANSLATION}
                            translationKeyPrefix={TRANSLATION.DRINKS}
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
                        iconName={ICONS.PLUS}
                        secondIconName={ICONS.LEMON}
                        color={showAddGarnish ? COLORS.ADDBUTTON_OPEN : COLORS.ADDBUTTON_CLOSED}
                        text={showAddGarnish ? tCommon('buttons.button_close') : ''}
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
                        <Button
                            iconName={ICONS.PLUS_SQUARE}
                            text={t('do_drink')}
                            onClick={() => {
                                if (window.confirm(t('do_drink_confirm'))) {
                                    saveDrinkHistory(params.id);
                                }
                            }}
                        />
                        &nbsp;
                        <Button
                            iconName={ICONS.PLUS_SQUARE}
                            text={t('shopcart_tooltip')}
                            onClick={() => {
                                if (window.confirm(t('shopcart_tooltip_confirm'))) {
                                    makeShoppingList(params.id);
                                }
                            }}
                        />
                    </>
                </Tab>
            </Tabs>
            <hr />
            {
                drinkHistory != null && drinkHistory.length > 0 ? (
                    <RecipeHistories
                        dbUrl={DB.DRINK_HISTORY}
                        translation={TRANSLATION.TRANSLATION}
                        translationKeyPrefix={TRANSLATION.DRINKS}
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
            <ImageComponent objID={params.id} url={DB.DRINK_IMAGES} />
            <CommentComponent objID={params.id} url={DB.DRINK_COMMENTS} onSave={addCommentToDrink} />
            <LinkComponent objID={params.id} url={DB.DRINK_LINKS} onSaveLink={addLinkToDrink} />
        </PageContentWrapper>
    )
}
