import { ref, onValue, child } from 'firebase/database';
import { useEffect, useState } from "react";

import { db } from '../../firebase-config';
import { useAuth } from '../../contexts/AuthContext';
import { userDatabasePath } from '../../datatier/userDatabasePaths';

const useFetchChildren = (url, objectID) => {
    const { currentUser } = useAuth();
    const uid = currentUser?.uid;

    //states
    const [loading, setLoading] = useState(true);
const [counter, setCounter] = useState(0);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        if (!uid) {
            setData([]);
            setOriginalData([]);
            setCounter(0);
            setLoading(false);
            return;
        }

        setLoading(true);
        const dbref = child(ref(db, userDatabasePath(url, uid)), objectID);
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
            setData(fromDB);
            setOriginalData(fromDB);
            setLoading(false);
            setCounter(counterTemp);
        });

        return () => {
            unsubscribe();
        };
    }, [url, objectID, uid])

    return { data, setData, originalData, counter, loading, setCounter };
}

export default useFetchChildren;


