//react
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
//firebase
import { ref, onValue, update } from "firebase/database";
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
//utils
import { getCurrentDateAsJson, getJsonAsDateTimeString } from "../../utils/DateTimeUtils";
import { getExerciseCategoryNameByID } from "../../utils/ListUtils";
//i18n
import i18n from "i18next";

const ExerciseDetails = () => {

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

    return (
        loading ? (
            <h3>{t('loading')}</h3>
        ) : (
            <div>
                <GoBackButton />
                <h3 className='page-title'>{t('exercisedetails')}</h3>
                <SetStarRating starCount={exercise.stars} onSaveStars={saveStars} />
                <p>{t('date_and_time')}: {exercise.date} {exercise.time}</p>
                <p>{t('created_by')}: {exercise.createdBy}</p>
                <p>{t('created')}: {getJsonAsDateTimeString(exercise.created, i18n.language)}</p>
                <p>{t('category')}: {t('category_' + getExerciseCategoryNameByID(exercise.category))}</p>
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
            </div>
        )
    )
}

export default ExerciseDetails
