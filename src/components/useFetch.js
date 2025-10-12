import { useEffect, useState } from "react";
import { db } from '../firebase-config';
import { ref, onValue } from 'firebase/database';
import { LIST_TYPES } from '../utils/Constants';

const useFetch = (url, listType, objectID, subObjectID) => {

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

    const getFullUrl = () => {

        var onlyObjectIdGiven = objectID != null && subObjectID == null;
        var objectIdAndSubIdGive = objectID != null && subObjectID != null;
        if (onlyObjectIdGiven) {
            return `${url}/${objectID}`;
        } else if (objectIdAndSubIdGive) {
            return `${url}/${objectID}/${subObjectID}`;
        }

        return url;
    }

    const fetchDataFromFirebase = async () => {

        //console.log("listType", listType);

        const fullUrl = getFullUrl();
        //console.log("fetching data from url: ", fullUrl);
        const dbref = ref(db, fullUrl);
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
                    } else if (listType === LIST_TYPES.COMMON) {
                        counterTemp++;
                        fromDB.push({ id, ...snap[id] });
                    }
                }
            }

            //Data is:
            //console.log("Data is", fromDB);

            //snap didn't contain data, so lets assume snap is the only object
            if (fromDB.length < 1) {
                setCounter(1);
                setLoading(false);
                setData(snap);
                setOriginalData(snap);
                console.log("Data is", snap);
                return;
            }

            //console.log("Data is", fromDB);
            //console.log("loading is", loading);

            setCounter(counterTemp);
            setLoading(false);
            setData(fromDB);
            setOriginalData(fromDB);
        })

    }

    return { data, setData, originalData, counter, loading };
}

export default useFetch;