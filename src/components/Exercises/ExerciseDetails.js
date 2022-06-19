//react
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//firebase
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase-config";
//buttons
import GoBackButton from "../GoBackButton";
//exercises
import AddPartsGym from "./AddPartsGym";
import { Categories } from "./Categories";

const ExerciseDetails = () => {

    //params
    const params = useParams();

    //navigation
    const navigate = useNavigate();

    //states
    const [exercise, setExercise] = useState({});
    const [loading, setLoading] = useState(true);

    //load data
    useEffect(() => {
        const getExercise = async () => {
            await fetchExerciseFromFirebase();
        }
        getExercise()
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

    return (
        <div>
            <GoBackButton />
            <h3 className='page-title'>ExerciseDetails</h3>

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
}

export default ExerciseDetails
