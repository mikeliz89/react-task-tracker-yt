import { onValue, ref } from "firebase/database";
import { useState, useEffect } from "react";

import { db } from '../../firebase-config';
import { useAuth } from '../../contexts/AuthContext';
import { userDatabasePath } from '../../datatier/userDatabasePaths';

const useFireStore = (collection, url, objectID) => {
    const { currentUser } = useAuth();
    const uid = currentUser?.uid;

    const [docs, setDocs] = useState([]);

    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (!uid) {
            setDocs([]);
            setCounter(0);
            return;
        }

        const dbref = ref(db, userDatabasePath(`${url}/${objectID}`, uid));
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
    }, [collection, url, objectID, uid]);

    return { docs };
}

export default useFireStore;


