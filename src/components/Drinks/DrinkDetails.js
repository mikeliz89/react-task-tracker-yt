import { ref, child, onValue } from 'firebase/database';
import i18n from "i18next";
import { useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { pushToFirebase, pushToFirebaseById, pushToFirebaseChild, removeFromFirebaseByIdAndSubId, updateToFirebaseById }
    from '../../datatier/datatier';
import { db } from '../../firebase-config';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION } from '../../utils/Constants';
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils';
import { ListTypes, RecipeTypes } from '../../utils/Enums';
import { getDrinkCategoryNameByID } from '../../utils/ListUtils';
import Button from '../Buttons/Button';
import CommentComponent from '../Comments/CommentComponent';
import { useAlert } from '../Hooks/useAlert';
import useFetch from '../Hooks/useFetch';
import useFetchChildren from '../Hooks/useFetchChildren';
import { useToggle } from '../Hooks/useToggle';
import ImageComponent from '../ImageUpload/ImageComponent';
import LinkComponent from '../Links/LinkComponent';
import AddIncredient from '../Recipe/AddIncredient';
import AddWorkPhase from '../Recipe/AddWorkPhase';
import { getIncredientsUrl } from '../Recipe/Categories';
import Incredients from '../Recipe/Incredients';
import RecipeHistories from '../Recipe/RecipeHistories';
import WorkPhases from '../Recipe/WorkPhases';
import CenterWrapper from '../Site/CenterWrapper';
import DetailsPage from '../Site/DetailsPage';

import AddDrink from './AddDrink';
import AddGarnish from './AddGarnish';
import Garnishes from './Garnishes';

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
    const {
        message,
        showMessage,
        error,
        showError,
        clearMessages,
        showSuccess,
        showFailure
    } = useAlert();

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
            showFailure(t('failed_to_save_drink'));
            console.warn(error)
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
        showSuccess(t('save_success_drinkinghistory'));
    }


    const makeShoppingList = async (drinkID) => {

        const incredients = await fetchIncredientsFromFirebase(drinkID);

        if (incredients && incredients.length > 0) {
            let currentDateTime = getJsonAsDateTimeString(getCurrentDateAsJson(), i18n.language);
            addTaskList({ title: `${t('shoppinglist')} ${currentDateTime}` }, incredients).then(() => {
                navigate(NAVIGATION.MANAGE_SHOPPINGLISTS)
            });
        } else if (incredients && incredients.length <= 0) {
            showFailure(t('shoppinglist_no_incredients'));
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

    return (
        <DetailsPage
            item={drink}
            id={params.id}
            dbKey={DB.DRINKS}
            loading={loading}
            showEditButton={true}
            isEditOpen={showEditDrink}
            onToggleEdit={toggleSetShowEditDrink}
            title={drink?.title}
            preSummaryContent={
                <>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('category')}:</span>{' '}
                        <span className="detailspage-meta-value">{t(`category_${getDrinkCategoryNameByID(drink?.category)}`)}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('glass')}:</span>{' '}
                        <span className="detailspage-meta-value">{drink?.glass || '-'}</span>
                    </div>
                    <div className="detailspage-field">
                        <span className="detailspage-meta-label">{t('incredients')}:</span>{' '}
                        <span className="detailspage-meta-value">{drink?.incredients || '-'}</span>
                    </div>
                </>
            }
            summary={`${t('description')}: ${drink?.description || '-'}`}
            metaItems={[
                {
                    id: 1,
                    content: <><span className="detailspage-meta-label">{t('created')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(drink?.created, i18n.language)}</span></>
                },
                {
                    id: 2,
                    content: <><span className="detailspage-meta-label">{t('created_by')}:</span> <span className="detailspage-meta-value">{drink?.createdBy || '-'}</span></>
                },
                {
                    id: 3,
                    content: <><span className="detailspage-meta-label">{t('modified')}:</span> <span className="detailspage-meta-value">{getJsonAsDateTimeString(drink?.modified, i18n.language)}</span></>
                }
            ]}
            editModalTitle={t('modal_header_edit_drink')}
            editSection={<AddDrink onSave={updateDrink} drinkID={params.id} onClose={toggleSetShowEditDrink} />}
            alertProps={{
                message,
                showMessage,
                error,
                showError,
                onClose: clearMessages,
                alertColLg: 12,
            }}
            preImageSection={
                <>
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
                                        items={incredients}
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
                                    items={workPhases}
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
                                    items={garnishes}
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
                        <Tab eventKey="recipeView" title={t('tabheader_recipe_view')}>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: 250 }}>
                                    <h5>{t('incredients_header')}</h5>
                                    {incredients && incredients.length > 0 ? (
                                        <ul style={{ paddingLeft: 20 }}>
                                            {incredients.map((item, idx) => (
                                                <li key={item.id || idx}>{item.name}{item.amount ? ` (${item.amount}${item.unit ? ' ' + item.unit : ''})` : ''}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <CenterWrapper>{t('no_incredients_to_show')}</CenterWrapper>
                                    )}
                                </div>
                                <div style={{ flex: 1, minWidth: 250 }}>
                                    <h5>{t('workphases_header')}</h5>
                                    {workPhases && workPhases.length > 0 ? (
                                        <ol style={{ paddingLeft: 20 }}>
                                            {workPhases.map((item, idx) => (
                                                <li key={item.id || idx}>{item.name || item.text || item.description}</li>
                                            ))}
                                        </ol>
                                    ) : (
                                        <CenterWrapper>{t('no_workphases_to_show')}</CenterWrapper>
                                    )}
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="drinkHistory" title={t('drink_history_header')}>
                            <Button
                                iconName={ICONS.PLUS_SQUARE}
                                text={t('do_drink')}
                                onClick={() => {
                                    if (window.confirm(t('do_drink_confirm'))) {
                                        saveDrinkHistory(params.id);
                                    }
                                }}
                            />
                            {drinkHistory != null && drinkHistory.length > 0 ? (
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
                            )}
                        </Tab>
                        <Tab eventKey="actions" title={t('tabheader_actions')}>
                            <>
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
                </>
            }
            imageSection={<ImageComponent objID={params.id} url={DB.DRINK_IMAGES} />}
            commentSection={<CommentComponent objID={params.id} url={DB.DRINK_COMMENTS} onSave={addCommentToDrink} />}
            linkSection={<LinkComponent objID={params.id} url={DB.DRINK_LINKS} onSaveLink={addLinkToDrink} />}
        />
    )
}



