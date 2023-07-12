import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, ButtonGroup, Accordion, Table } from "react-bootstrap";
import { ref, onValue } from 'firebase/database';
import { db } from "../../firebase-config";
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
import * as Constants from '../../utils/Constants';
import i18n from "i18next";
import PageTitle from '../Site/PageTitle';
import Alert from "../Alert";
import PageContentWrapper from "../Site/PageContentWrapper";
import { pushToFirebaseChild, updateToFirebaseById } from "../../datatier/datatier";
import LinkComponent from "../Links/LinkComponent";
import ImageComponent from "../ImageUpload/ImageComponent";
import StarRatingWrapper from "../StarRating/StarRatingWrapper";

const ExerciseDetails = () => {

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //states
    const [exercise, setExercise] = useState({});
    const [loading, setLoading] = useState(true);
    const [showEditExercise, setShowEditExercise] = useState(false);

    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error] = useState('');

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_EXERCISES, { keyPrefix: Constants.TRANSLATION_EXERCISES });

    //auth
    const { currentUser } = useAuth();

    //load data
    useEffect(() => {
        const getExercise = async () => {
            await fetchExerciseFromFirebase();
        }
        getExercise();
    }, [])

    const fetchExerciseFromFirebase = async () => {
        const dbref = ref(db, `${Constants.DB_EXERCISES}/${params.id}`);
        onValue(dbref, (snapshot) => {
            const data = snapshot.val();
            if (data === null) {
                navigate(-1);
            }
            setExercise(data)
            setLoading(false);
        })
    }

    const saveStars = async (stars) => {
        const exerciseID = params.id;
        exercise["modified"] = getCurrentDateAsJson()
        exercise["stars"] = Number(stars);
        updateToFirebaseById(Constants.DB_EXERCISES, exerciseID, exercise);
    }

    const addCommentToExercise = async (comment) => {
        let id = params.id;
        comment["created"] = getCurrentDateAsJson()
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        pushToFirebaseChild(Constants.DB_EXERCISE_COMMENTS, id, comment);
    }

    const addLinkToExercise = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        pushToFirebaseChild(Constants.DB_EXERCISE_LINKS, id, link);
    }

    return (
        loading ? (
            <h3>{t('loading')}</h3>
        ) : (
            <PageContentWrapper>
                <Row>
                    <ButtonGroup>
                        <GoBackButton />
                        <Button
                            iconName={Constants.ICON_EDIT}
                            onClick={() => setShowEditExercise(!showEditExercise)}
                            color={showEditExercise ? 'red' : 'orange'}
                            text={showEditExercise ? t('close') : t('button_edit')} />
                    </ButtonGroup>
                </Row>
                <Row>
                    <Col>
                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>
                                    <PageTitle title={t('exercisedetails')} />
                                </Accordion.Header>
                                <Accordion.Body>
                                    <Table striped bordered hover>
                                        <tbody>
                                            <tr>
                                                <td>{t('created')}</td>
                                                <td>{getJsonAsDateTimeString(exercise.created, i18n.language)}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('created_by')}</td>
                                                <td>{exercise.createdBy}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('modified')}</td>
                                                <td>{getJsonAsDateTimeString(exercise.modified, i18n.language)}</td>
                                            </tr>
                                            <tr>
                                                <td>{t('category')}</td>
                                                <td>{t('category')}: {t('category_' + getExerciseCategoryNameByID(exercise.category))}</td>
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
                        <StarRatingWrapper stars={exercise.stars} onSaveStars={saveStars} />
                    </Col>
                </Row>
                {showEditExercise && <EditExercise exerciseID={params.id} exercise={exercise} onClose={() => setShowEditExercise(false)} />}

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

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
                        Number(exercise.category) === Categories.BikingInside ||
                        Number(exercise.category) === Categories.Biking ||
                        Number(exercise.category) === Categories.Kayaking ||
                        Number(exercise.category) === Categories.Running ||
                        Number(exercise.category) === Categories.Walking
                    ) &&
                    <AddPartsMoving title={getTitleByCategory(exercise.category)}
                        iconName={getIconNameByCategory(exercise.category)} />
                }
                <ImageComponent objID={params.id} url={Constants.DB_EXERCISE_IMAGES} />
                <CommentComponent objID={params.id} url={Constants.DB_EXERCISE_COMMENTS} onSave={addCommentToExercise} />
                <LinkComponent objID={params.id} url={Constants.DB_EXERCISE_LINKS} onSaveLink={addLinkToExercise} />
            </PageContentWrapper >
        )
    )
}

export default ExerciseDetails
