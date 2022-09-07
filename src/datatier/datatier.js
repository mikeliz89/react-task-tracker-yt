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

export const pushToFirebaseById = async (path, mainID, object) => {
    const dbref = ref(db, `${path}/${mainID}`);
    push(dbref, object);
}

export const pushToFirebaseChild = async (path, mainID, object) => {
    const dbref = child(ref(db, path), mainID);
    return push(dbref, object).key;
}

export const updateToFirebase = async (updates) => {
    update(ref(db), updates);
}