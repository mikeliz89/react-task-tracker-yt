import { db } from '../firebase-config';
import { update, ref, onValue, push, child, remove, get } from "firebase/database";

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
    return push(dbref, object).key;
}

export const pushToFirebaseById = async (path, id, object) => {
    const dbref = ref(db, `${path}/${id}`);
    return push(dbref, object).key;
}

export const pushToFirebaseChild = async (path, id, object) => {
    const dbref = child(ref(db, path), id);
    return push(dbref, object).key;
}

export const updateToFirebase = async (updates) => {
    update(ref(db), updates);
}

export const updateToFirebaseById = async (path, id, object) => {
    const updates = {};
    updates[`${path}/${id}`] = object;
    update(ref(db), updates);
}