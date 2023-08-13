import { useEffect, useState } from "react";
import { db } from '../firebase-config';
import { ref, onValue } from 'firebase/database';

const useFetch = (url, listType) => {

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
        const dbref = ref(db, url);
        onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;
            for (let id in snap) {
                const item = snap[id];
                //list type not given
                if (listType === undefined) {
                    counterTemp++;
                    fromDB.push({ id, ...snap[id] });
                } else {
                    //listtype given, must match item listtype.
                    //TODO: Do not fetch with wrong listType from DB at all?
                    if ((item["listType"] === listType && listType > 0) ||
                        (item["listType"] === undefined && listType === 0)) {
                        counterTemp++;
                        fromDB.push({ id, ...snap[id] });
                    }
                }
            }
            setCounter(counterTemp);
            setLoading(false);
            setData(fromDB);
            setOriginalData(fromDB);
        })
    }

    return { data, setData, originalData, counter, loading };
}

export default useFetch;