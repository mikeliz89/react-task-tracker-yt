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
import { Categories } from "./Categories";
//star rating
import SetStarRating from "../StarRating/SetStarRating";
//utils
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";

const ExerciseDetails = () => {

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
        const dbref = ref(db, '/exercises/' + params.id);
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
        updates[`/exercises/${exerciseID}`] = exercise;
        update(ref(db), updates);
    }

    return (
        loading ? (
            <h3>{t('loading')}</h3>
        ) : (
            <div>
                <GoBackButton />
                <h3 className='page-title'>ExerciseDetails</h3>
                <SetStarRating starCount={exercise.stars} onSaveStars={saveStars} />
                <p>Date and time: {exercise.date} {exercise.time}</p>
                <p>Created by: {exercise.createdBy}</p>
                <p>Created: {exercise.created}</p>
                <p>Category: {exercise.category}</p>
                {
                    exercise.category === Categories.Gym &&
                    <AddPartsGym />
                }
            </div>
        )
    )
}

export default ExerciseDetails