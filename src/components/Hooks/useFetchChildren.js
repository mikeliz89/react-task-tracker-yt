import { ref, onValue, child } from 'firebase/database';
import { useEffect, useState } from "react";

import { db } from '../../firebase-config';

const useFetchChildren = (url, objectID) => {

    //states
    const [loading, setLoading] = useState(true);
const [counter, setCounter] = useState(0);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        const dbref = child(ref(db, url), objectID);
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
    }, [url, objectID])

    return { data, setData, originalData, counter, loading, setCounter };
}

export default useFetchChildren;


