import { useState, useEffect } from "react";
import * as Constants from '../utils/Constants';
import { onValue, ref } from "firebase/database";
import { db } from '../firebase-config';

const useFireStore = (collection, objectID) => {

    const [docs, setDocs] = useState([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let cancel = false;

        const getImages = async () => {
            if (cancel) {
                return;
            }
            await fetchImagesFromFirebase();
        }
        getImages();

        return () => {
            cancel = true;
        }
    }, collection, objectID);

    const fetchImagesFromFirebase = async () => {
        const dbref = await ref(db, `${Constants.DB_RECIPE_IMAGES}/${objectID}`);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setCounter(counterTemp);
            setDocs(fromDB);
        })
    }

    return { docs };
}

export default useFireStore;