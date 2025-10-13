import { useState, useEffect } from 'react';
import { getFromFirebaseByIdAndSubId } from '../../datatier/datatier';

export default function useFetchByIdAndSubId(dbName, id, subId) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id && subId) {
            getFromFirebaseByIdAndSubId(dbName, id, subId).then(setData);
        } else {
            setData(null);
        }
    }, [dbName, id, subId]);

    return data;
}