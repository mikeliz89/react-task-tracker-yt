import { onValue, ref } from "firebase/database";
import { useState, useEffect } from "react";

import { db } from '../../firebase-config';

const useFireStore = (collection, url, objectID) => {

    const [docs, setDocs] = useState([]);

const [counter, setCounter] = useState(0);

    useEffect(() => {
        const dbref = ref(db, `${url}/${objectID}`);
        const unsubscribe = onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            if (snap != null) {
                for (let id in snap) {
                    counterTemp++;
                    fromDB.push({ id, ...snap[id] });
                }
            }
            setCounter(counterTemp);
            setDocs(fromDB);
        });

        return () => {
            unsubscribe();
        };
    }, [collection, url, objectID]);

    return { docs };
}

export default useFireStore;


