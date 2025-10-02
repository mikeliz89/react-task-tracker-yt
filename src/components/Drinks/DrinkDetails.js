import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Row, ButtonGroup, Col, Tabs, Tab, Modal } from 'react-bootstrap';
import Button from '../Buttons/Button';
import GoBackButton from '../Buttons/GoBackButton';
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
import { useAuth } from '../../contexts/AuthContext';
import Alert from '../Alert';
import PageContentWrapper from '../Site/PageContentWrapper';
import CenterWrapper from '../Site/CenterWrapper';
import { pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById } from '../../datatier/datatier';
import LinkComponent from '../Links/LinkComponent';
import CommentComponent from '../Comments/CommentComponent';
import ImageComponent from '../ImageUpload/ImageComponent';
import StarRatingWrapper from '../StarRating/StarRatingWrapper';
import AccordionElement from '../AccordionElement';
import { useToggle } from '../useToggle';
import useFetch from '../useFetch';
import useFetchChildren from '../useFetchChildren';

export default function DrinkDetails() {

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
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_DRINKS });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: drink, loading } = useFetch(Constants.DB_DRINKS, "", params.id);
    const { data: incredients } = useFetchChildren(Constants.DB_DRINK_INCREDIENTS, params.id);
    const { data: workPhases } = useFetchChildren(Constants.DB_DRINK_WORKPHASES, params.id);
    const { data: garnishes } = useFetchChildren(Constants.DB_DRINK_GARNISHES, params.id);
    const { data: drinkHistory } = useFetchChildren(Constants.DB_DRINK_HISTORY, params.id);

    const updateDrink = async (drinkToUpdate) => {
        try {
            var drinkID = params.id;
            drinkToUpdate["modified"] = getCurrentDateAsJson();
            if (drinkToUpdate["isCore"] === undefined) {
                drinkToUpdate["isCore"] = false;
            }
            updateToFirebaseById(Constants.DB_DRINKS, drinkID, drinkToUpdate);
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

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(drink.created, i18n.language) },
            { id: 2, name: t('created_by'), value: drink.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(drink.modified, i18n.language) },
            { id: 4, name: t('glass'), value: drink.glass },
            { id: 5, name: t('category'), value: t('category_' + getDrinkCategoryNameByID(drink.category)) }
        ];
    }

    return loading ? (
        <h3>{tCommon("loading")}</h3>
    ) : (
        <PageContentWrapper>
            <Row>
                <ButtonGroup>
                    <GoBackButton />
                    <Button
                        iconName={Constants.ICON_EDIT}
                        text={showEditDrink ? t('button_close') : ''}
                        color={showEditDrink ? Constants.COLOR_EDITBUTTON_OPEN : Constants.COLOR_EDITBUTTON_CLOSED}
                        onClick={() => toggleSetShowEditDrink()} />
                </ButtonGroup>
            </Row>

            <AccordionElement array={getAccordionData()} title={drink.title} iconName={Constants.ICON_GLASS_MARTINI} />

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
                variant={Constants.VARIANT_SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
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
                        iconName={Constants.ICON_PLUS}
                        secondIconName={Constants.ICON_CARROT}
                        color={showAddIncredient ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
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
                        color={showAddWorkPhase ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
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
                        color={showAddGarnish ? Constants.COLOR_ADDBUTTON_OPEN : Constants.COLOR_ADDBUTTON_CLOSED}
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
                        <Button
                            iconName={Constants.ICON_PLUS_SQUARE}
                            text={t('do_drink')}
                            onClick={() => {
                                if (window.confirm(t('do_drink_confirm'))) {
                                    saveDrinkHistory(params.id);
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
