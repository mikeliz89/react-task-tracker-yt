import { ref, onValue } from 'firebase/database';
import { useEffect, useState } from "react";

import { db } from '../../firebase-config';
import { LIST_TYPES } from '../../utils/Constants';

const useFetch = (url, listType, objectID, subObjectID) => {

    //states
    const [loading, setLoading] = useState(true);
    const [counter, setCounter] = useState(0);
    const [data, setData] = useState({});
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        var fullUrl = url;
        var onlyObjectIdGiven = objectID != null && subObjectID == null;
        var objectIdAndSubIdGive = objectID != null && subObjectID != null;
        if (onlyObjectIdGiven) {
            fullUrl = `${url}/${objectID}`;
        } else if (objectIdAndSubIdGive) {
            fullUrl = `${url}/${objectID}/${subObjectID}`;
        }

        const dbref = ref(db, fullUrl);
        const unsubscribe = onValue(dbref, (snapshot) => {
            const snap = snapshot.val();
            const fromDB = [];
            let counterTemp = 0;

            if (snap != null && typeof snap === 'object') {
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
            }

            //snap didn't contain data, so lets assume snap is the only object
            if (fromDB.length < 1) {
                setCounter(snap == null ? 0 : 1);
                setLoading(false);
                setData(snap);
                setOriginalData(snap);
                return;
            }

            setCounter(counterTemp);
            setLoading(false);
            setData(fromDB);
            setOriginalData(fromDB);
        });

        return () => {
            unsubscribe();
        };
    }, [url, listType, objectID, subObjectID])

    return { data, setData, originalData, counter, loading };
}

export default useFetch;


