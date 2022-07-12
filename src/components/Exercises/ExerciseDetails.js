//react
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Row, Col } from "react-bootstrap";
//firebase
import { child, push, ref, onValue, update } from "firebase/database";
import { db } from "../../firebase-config";
//buttons
import GoBackButton from "../GoBackButton";
//exercises
import AddPartsGym from "./AddPartsGym";
import AddPartsRunning from "./AddPartsRunning";
import AddPartsWalking from "./AddPartsWalking";
import { Categories } from "./Categories";
//star rating
import SetStarRating from "../StarRating/SetStarRating";
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

const ExerciseDetails = () => {

    const DB_EXERCISE_COMMENTS = '/exercise-comments';
    const DB_EXERCISES = '/exercises';

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //states
    const [exercise, setExercise] = useState({});
    const [loading, setLoading] = useState(true);

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

    /** Fetch Recipe From Firebase */
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
        //save edited drink to firebase
        const updates = {};
        exercise["modified"] = getCurrentDateAsJson()
        exercise["stars"] = Number(stars);
        updates[`${DB_EXERCISES}/${exerciseID}`] = exercise;
        update(ref(db), updates);
    }

    const addCommentToExercise = async (comment) => {
        let taskID = params.id;
        comment["created"] = getCurrentDateAsJson()
        comment["createdBy"] = currentUser.email;
        comment["creatorUserID"] = currentUser.uid;
        const dbref = child(ref(db, DB_EXERCISE_COMMENTS), taskID);
        push(dbref, comment);
    }

    return (
        loading ? (
            <h3>{t('loading')}</h3>
        ) : (
            <div>
                <GoBackButton />
                <h3 className='page-title'>{t('exercisedetails')}</h3>
                <SetStarRating starCount={exercise.stars} onSaveStars={saveStars} />
                <AddComment onSave={addCommentToExercise} />
                {/*<AddLink onSaveLink={addLinkToTask} /> */}
                <Row>
                    <Col>
                        {t('date_and_time')}: {exercise.date} {exercise.time} <br />
                        {t('created_by')}: {exercise.createdBy} <br />
                        {t('created')}: {getJsonAsDateTimeString(exercise.created, i18n.language)}<br />
                        {t('category')}: {t('category_' + getExerciseCategoryNameByID(exercise.category))}
                    </Col>
                </Row>
                {
                    Number(exercise.category) === Categories.Gym &&
                    <AddPartsGym />
                }
                {
                    Number(exercise.category) === Categories.Running &&
                    <AddPartsRunning />
                }
                {
                    Number(exercise.category) === Categories.Walking &&
                    <AddPartsWalking />
                }
                <Comments objID={params.id} url={'exercise-comments'} />
            </div>
        )
    )
}

export default ExerciseDetails
