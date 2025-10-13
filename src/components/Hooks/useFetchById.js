import { useState, useEffect } from 'react';
import { getFromFirebaseById } from '../../datatier/datatier';

export default function useFetchById(dbName, id) {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (id != null) {
            getFromFirebaseById(dbName, id).then(setData);
        }
    }, [dbName, id]);

    return data;
}