import { update, ref, push, child, remove, get, onValue } from 'firebase/database';

import { db } from '../firebase-config';
import { auth } from '../firebase-config';
import { userDatabasePath, userDatabaseUpdates } from './userDatabasePaths';

const userRef = (path) => ref(db, userDatabasePath(path, auth.currentUser?.uid));

export const removeFromFirebaseById = async (path, id) => {
    const dbref = userRef(`${path}/${id}`);
    remove(dbref)
}

export const removeFromFirebaseByIdAndSubId = async (path, mainID, subID) => {
    const dbref = userRef(`${path}/${mainID}/${subID}`);
    remove(dbref);
}

export const removeFromFirebaseChild = async (path, id) => {
    const dbref = child(userRef(path), id);
    remove(dbref);
}

export const pushToFirebase = async (path, object) => {
    const dbref = userRef(path);
    fixObject(object);
    return push(dbref, object).key;
}

export const pushToFirebaseById = async (path, id, object) => {
    const dbref = userRef(`${path}/${id}`);
    fixObject(object);
    return push(dbref, object).key;
}

export const pushToFirebaseChild = async (path, id, object) => {
    const dbref = child(userRef(path), id);
    fixObject(object);
    return push(dbref, object).key;
}

export const updateToFirebase = async (object) => {
    fixObject(object);
    return update(ref(db), userDatabaseUpdates(object, auth.currentUser?.uid));
}

export const updateToFirebaseById = async (path, id, object) => {
    const updates = {};
    fixObject(object);
    updates[`${path}/${id}`] = object;
    return update(ref(db), userDatabaseUpdates(updates, auth.currentUser?.uid));
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
    return update(ref(db), userDatabaseUpdates(updates, auth.currentUser?.uid));
}

export const getFromFirebaseById = async (path, id) => {
    const dbref = userRef(`${path}/${id}`);
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
    const dbref = userRef(`${path}/${mainID}/${subID}`);
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
    const dbref = child(userRef(path), id);
    const snapshot = await get(dbref);

    if (!snapshot.exists()) {
        return [];
    }

    return mapSnapshotToArray(snapshot);
}

export const getFromFirebaseAsArray = async (path) => {
    const dbref = userRef(path);
    const snapshot = await get(dbref);

    if (!snapshot.exists()) {
        return [];
    }

    return mapSnapshotToArray(snapshot);
}

export const createFirebaseChildKey = (path, id) => {
    return push(child(userRef(path), id)).key;
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
    const dbref = child(userRef(path), id);
    return onValue(dbref, (snapshot) => {
        onData(mapSnapshotToArray(snapshot));
    });
}

export const subscribeToFirebaseAsArray = (path, onData) => {
    const dbref = userRef(path);
    return onValue(dbref, (snapshot) => {
        onData(mapSnapshotToArray(snapshot));
    });
}

export const subscribeToFirebase = (path, onData) => {
    const dbref = userRef(path);
    return onValue(dbref, onData);
}

export const subscribeToFirebaseByIdAsArray = (path, id, onData) => {
    const dbref = userRef(`${path}/${id}`);
    return onValue(dbref, (snapshot) => {
        onData(mapSnapshotToArray(snapshot));
    });
}

export const subscribeToFirebaseById = (path, id, onData) => {
    const dbref = userRef(`${path}/${id}`);
    return onValue(dbref, onData);
}



