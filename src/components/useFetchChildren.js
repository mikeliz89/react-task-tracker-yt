import { useEffect, useState } from "react";
import { db } from '../firebase-config';
import { ref, onValue, child } from 'firebase/database';

const useFetchChildren = (url, objectID) => {

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        let cancel = false;

        const getData = async () => {
            if (cancel) {
                return;
            }
            await fetchDataFromFirebase();
        }
        getData();

        return () => {
            cancel = true;
        }
    }, [url])

    const fetchDataFromFirebase = async () => {
        const dbref = child(ref(db, url), objectID);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                counterTemp++;
                fromDB.push({ id, ...snap[id] });
            }
            setData(fromDB);
            setOriginalData(fromDB);
            setLoading(false);
            setCounter(counterTemp);
        })
    }

    return { data, setData, originalData, counter, loading, setCounter };
}

export default useFetchChildren;