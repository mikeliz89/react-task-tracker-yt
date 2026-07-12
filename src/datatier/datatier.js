import { update, ref, push, child, remove, get, onValue } from 'firebase/database';

import { db } from '../firebase-config';

export const removeFromFirebaseById = async (path, id) => {
    const dbref = ref(db, `${path}/${id}`);
    remove(dbref)
}

export const removeFromFirebaseByIdAndSubId = async (path, mainID, subID) => {
    const dbref = ref(db, `${path}/${mainID}/${subID}`);
    remove(dbref);
}

export const removeFromFirebaseChild = async (path, id) => {
    const dbref = child(ref(db, path), id);
    remove(dbref);
}

export const pushToFirebase = async (path, object) => {
    const dbref = ref(db, path);
    fixObject(object);
    return push(dbref, object).key;
}

export const pushToFirebaseById = async (path, id, object) => {
    const dbref = ref(db, `${path}/${id}`);
    fixObject(object);
    return push(dbref, object).key;
}

export const pushToFirebaseChild = async (path, id, object) => {
    const dbref = child(ref(db, path), id);
    fixObject(object);
    return push(dbref, object).key;
}

export const updateToFirebase = async (object) => {
    fixObject(object);
    update(ref(db), object);
}

export const updateToFirebaseById = async (path, id, object) => {
    const updates = {};
    fixObject(object);
    updates[`${path}/${id}`] = object;
    update(ref(db), updates);
}

const fixObject = (obj) => {
    for (var i in obj) {
        if (obj[i] === undefined) {
            obj[i] = null;
        }
    }
}

export const updateToFirebaseByIdAndSubId = async (path, mainID, subID, object) => {
    const updates = {};
    fixObject(object);
    updates[`${path}/${mainID}/${subID}`] = object;
    update(ref(db), updates);
}

export const getFromFirebaseById = async (path, id) => {
    const dbref = ref(db, `${path}/${id}`);
    return new Promise(function (resolve, reject) {
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                return resolve(val);
            }
            return reject();
        });
    });
}

export const getFromFirebaseByIdAndSubId = async (path, mainID, subID) => {
    const dbref = ref(db, `${path}/${mainID}/${subID}`);
    return new Promise(function (resolve, reject) {
        get(dbref).then((snapshot) => {
            if (snapshot.exists()) {
                var val = snapshot.val();
                return resolve(val);
            }
            return reject();
        });
    });
}

export const getFromFirebaseChildAsArray = async (path, id) => {
    const dbref = child(ref(db, path), id);
    const snapshot = await get(dbref);

    if (!snapshot.exists()) {
        return [];
    }

    return mapSnapshotToArray(snapshot);
}

export const getFromFirebaseAsArray = async (path) => {
    const dbref = ref(db, path);
    const snapshot = await get(dbref);

    if (!snapshot.exists()) {
        return [];
    }

    return mapSnapshotToArray(snapshot);
}

export const createFirebaseChildKey = (path, id) => {
    return push(child(ref(db, path), id)).key;
}

const mapSnapshotToArray = (snapshot) => {
    const snap = snapshot.val();
    const fromDB = [];

    if (snap != null && typeof snap === 'object') {
        for (let id in snap) {
            fromDB.push({ id, ...snap[id] });
        }
    }

    return fromDB;
}

export const subscribeToFirebaseChildAsArray = (path, id, onData) => {
    const dbref = child(ref(db, path), id);
    return onValue(dbref, (snapshot) => {
        onData(mapSnapshotToArray(snapshot));
    });
}

export const subscribeToFirebaseAsArray = (path, onData) => {
    const dbref = ref(db, path);
    return onValue(dbref, (snapshot) => {
        onData(mapSnapshotToArray(snapshot));
    });
}

export const subscribeToFirebaseByIdAsArray = (path, id, onData) => {
    const dbref = ref(db, `${path}/${id}`);
    return onValue(dbref, (snapshot) => {
        onData(mapSnapshotToArray(snapshot));
    });
}

export const subscribeToFirebaseById = (path, id, onData) => {
    const dbref = ref(db, `${path}/${id}`);
    return onValue(dbref, onData);
}



