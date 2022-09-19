import { useState, useEffect } from "react";
import { storage } from "../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { pushToFirebaseById } from "../datatier/datatier";
import { getCurrentDateAsJson } from "../utils/DateTimeUtils";

//based on tutorial https://www.youtube.com/watch?v=vUe91uOx7R0
const useUploadToStorage = (file, imagesUrl, objectID) => {

    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(0);
    const [url, setUrl] = useState(null);

    //do everytime file changes
    useEffect(() => { 
        //references
        const storageRef = ref(storage, file.name);

        //async
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snap) => {
            let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
            setProgress(percentage);
        }, (err) => {
            setError(err);
        }, async () => {
            const url = await getDownloadURL(storageRef);
            setUrl(url);
            pushToFirebaseById(imagesUrl, objectID, { url: url, created: getCurrentDateAsJson() });
        })
    }, [file, imagesUrl, objectID]);

    return { progress, url, error }
}

export default useUploadToStorage;