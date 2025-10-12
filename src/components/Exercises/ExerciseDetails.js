import { useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, ButtonGroup, Table } from "react-bootstrap";
import GoBackButton from '../Buttons/GoBackButton';
import Button from '../Buttons/Button';
import AddPartsGym from "./AddPartsGym";
import AddPartsMoving from "./AddPartsMoving";
import AddPartsAerobics from "./AddPartsAerobics";
import EditExercise from "./EditExercise";
import { Categories, getTitleByCategory, getIconNameByCategory } from './Categories';
import { useAuth } from '../../contexts/AuthContext';
import CommentComponent from "../Comments/CommentComponent";
import { getCurrentDateAsJson, getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import { getExerciseCategoryNameByID } from "../../utils/ListUtils";
import { TRANSLATION, DB, ICONS, COLORS, VARIANTS } from '../../utils/Constants';
import i18n from "i18next";
import Alert from "../Alert";
import PageContentWrapper from "../Site/PageContentWrapper";
import { pushToFirebaseChild, updateToFirebaseById } from "../../datatier/datatier";
import LinkComponent from "../Links/LinkComponent";
import ImageComponent from "../ImageUpload/ImageComponent";
import StarRatingWrapper from "../StarRating/StarRatingWrapper";
import AccordionElement from "../AccordionElement";
import useFetch from "../useFetch";

export default function ExerciseDetails() {

    //params
    const params = useParams();

    //states
    const [showEditExercise, setShowEditExercise] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.EXERCISES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    //auth
    const { currentUser } = useAuth();

    //fetch data
    const { data: exercise, loading } = useFetch(DB.EXERCISES, "", params.id);

    const saveStars = async (stars) => {
        const exerciseID = params.id;
        exercise["modified"] = getCurrentDateAsJson()
        exercise["stars"] = Number(stars);
        updateToFirebaseById(DB.EXERCISES, exerciseID, exercise);
    }

    const addCommentToExercise = async (comment) => {
        let id = params.id;
        comment["created"] = getCurrentDateAsJson()
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(DB.EXERCISE_COMMENTS, id, comment);
    }

    const addLinkToExercise = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(DB.EXERCISE_LINKS, id, link);
    }

    const getAccordionData = () => {
        return [
            { id: 1, name: t('created'), value: getJsonAsDateTimeString(exercise.created, i18n.language) },
            { id: 2, name: t('created_by'), value: exercise.createdBy },
            { id: 3, name: t('modified'), value: getJsonAsDateTimeString(exercise.modified, i18n.language) },
            { id: 4, name: t('category'), value: t('category_' + getExerciseCategoryNameByID(exercise.category)) }
        ];
    }

    return (
        loading ? (
            <h3>{tCommon("loading")}</h3>
        ) : (
            <PageContentWrapper>
                <Row>
                    <ButtonGroup>
                        <GoBackButton />
                        <Button
                            iconName={ICONS.EDIT}
                            onClick={() => setShowEditExercise(!showEditExercise)}
                            color={showEditExercise ? COLORS.EDITBUTTON_OPEN : COLORS.EDITBUTTON_CLOSED}
                            text={showEditExercise ? tCommon('buttons.button_close') : tCommon('buttons.button_edit')} />
                    </ButtonGroup>
                </Row>

                <AccordionElement array={getAccordionData()} title={t('exercisedetails')} />

                <Row>
                    <Col>
                        <StarRatingWrapper stars={exercise.stars} onSaveStars={saveStars} />
                    </Col>
                </Row>
                {showEditExercise && <EditExercise exerciseID={params.id} exercise={exercise} onClose={() => setShowEditExercise(false)} />}

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant={VARIANTS.SUCCESS} onClose={() => { setShowMessage(false); setShowError(false); }}
                />

                <Table>
                    <tbody>
                        <tr>
                            <td>{t('date_and_time')}: {exercise.date} {exercise.time} </td>
                        </tr>
                        <tr>
                            <td>{t('end_date')}: {exercise.endDate} {exercise.endTime}</td>
                        </tr>
                        <tr>
                            <td>{t('duration')} : {t('coming_soon')}</td>
                        </tr>
                        <tr>
                            <td>{t('description')} : {exercise.description}</td>
                        </tr>
                    </tbody>
                </Table>

                {
                    Number(exercise.category) === Categories.Gym &&
                    <AddPartsGym />
                }
                {
                    Number(exercise.category) === Categories.Aerobics &&
                    <AddPartsAerobics />
                }
                {
                    (
                        showAddMoving(exercise)
                    ) &&
                    <AddPartsMoving title={getTitleByCategory(exercise.category)}
                        iconName={getIconNameByCategory(exercise.category)} />
                }
                <ImageComponent objID={params.id} url={DB.EXERCISE_IMAGES} />
                <CommentComponent objID={params.id} url={DB.EXERCISE_COMMENTS} onSave={addCommentToExercise} />
                <LinkComponent objID={params.id} url={DB.EXERCISE_LINKS} onSaveLink={addLinkToExercise} />
            </PageContentWrapper >
        )
    )
}

function showAddMoving(exercise) {
    return Number(exercise.category) === Categories.BikingInside ||
        Number(exercise.category) === Categories.Biking ||
        Number(exercise.category) === Categories.Kayaking ||
        Number(exercise.category) === Categories.Running ||
        Number(exercise.category) === Categories.Walking ||
        Number(exercise.category) === Categories.Skiing;
}
