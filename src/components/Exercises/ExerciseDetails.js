//react
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col, ButtonGroup, Accordion, Table } from "react-bootstrap";
//firebase
import { child, push, ref, onValue, update } from "firebase/database";
import { db } from "../../firebase-config";
//buttons
import GoBackButton from "../GoBackButton";
import Button from "../Button";
//exercises
import AddPartsGym from "./AddPartsGym";
import AddPartsMoving from "./AddPartsMoving";
import AddPartsAerobics from "./AddPartsAerobics";
import EditExercise from "./EditExercise";
import { Categories, getTitleByCategory, getIconNameByCategory } from './Categories';
//star rating
import SetStarRating from "../StarRating/SetStarRating";
import StarRating from "../StarRating/StarRating";
//comment
import AddComment from '../Comments/AddComment';
import Comments from '../Comments/Comments';
//auth
import { useAuth } from '../../contexts/AuthContext';
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import { getExerciseCategoryNameByID } from "../../utils/ListUtils";
//i18n
import i18n from "i18next";
//pagetitle
import PageTitle from "../PageTitle";
//alert
import Alert from "../Alert";
//Links
import AddLink from '../Links/AddLink';
import Links from '../Links/Links';
//page
import PageContentWrapper from "../PageContentWrapper";

const ExerciseDetails = () => {

    const DB_EXERCISE_LINKS = '/exercise-links';
    const DB_EXERCISE_COMMENTS = '/exercise-comments';
    const DB_EXERCISES = '/exercises';

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
    const { t } = useTranslation('exercises', { keyPrefix: 'exercises' });

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
        const dbref = ref(db, `${DB_EXERCISES}/${params.id}`);
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
        const updates = {};
        exercise["modified"] = getCurrentDateAsJson()
        exercise["stars"] = Number(stars);
        updates[`${DB_EXERCISES}/${exerciseID}`] = exercise;
        update(ref(db), updates);
    }

    const addCommentToExercise = async (comment) => {
        let id = params.id;
        comment["created"] = getCurrentDateAsJson()
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, DB_EXERCISE_COMMENTS), id);
        push(dbref, comment);
    }

    const addLinkToExercise = (link) => {
        const id = params.id;
        link["created"] = getCurrentDateAsJson();
        const dbref = child(ref(db, DB_EXERCISE_LINKS), id);
        push(dbref, link);
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
                            iconName='edit'
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
                        <StarRating starCount={exercise.stars} />
                    </Col>
                </Row>
                {showEditExercise && <EditExercise exerciseID={params.id} exercise={exercise} onClose={() => setShowEditExercise(false)} />}

                <Alert message={message} showMessage={showMessage}
                    error={error} showError={showError}
                    variant='success' onClose={() => { setShowMessage(false); setShowError(false); }} />

                <SetStarRating starCount={exercise.stars} onSaveStars={saveStars} />
                <AddComment onSave={addCommentToExercise} />
                <AddLink onSaveLink={addLinkToExercise} />

                <Row>
                    <Col>
                        {t('date_and_time')}: {exercise.date} {exercise.time} <br />
                        {t('end_date')}: {exercise.endDate} {exercise.endTime} <br />
                        {t('duration')} : {t('coming_soon')}<br />
                    </Col>
                </Row>
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
                <Comments objID={params.id} url={'exercise-comments'} />
                <Links objID={params.id} url={'exercise-links'} />
            </PageContentWrapper>
        )
    )
}

export default ExerciseDetails
