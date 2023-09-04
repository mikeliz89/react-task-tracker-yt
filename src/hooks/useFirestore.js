import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { db } from '../firebase-config';

const useFireStore = (collection, url, objectID) => {

    const [docs, setDocs] = useState([]);
    const [setCounter] = useState(0);

    useEffect(() => {
        let cancel = false;

        const getImages = async () => {
            if (cancel) {
                return;
            }
            await fetchImagesFromFirebase(url);
        }
        getImages();

        return () => {
            cancel = true;
        }
    }, collection, url, objectID);

    const fetchImagesFromFirebase = async (url) => {
        const dbref = await ref(db, `${url}/${objectID}`);
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