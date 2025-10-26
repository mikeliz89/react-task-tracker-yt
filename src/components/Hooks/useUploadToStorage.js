import { useState, useEffect } from "react";
import { storage } from "../../firebase-config";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { pushToFirebaseById } from "../../datatier/datatier";
import { getCurrentDateAsJson } from "../../utils/DateTimeUtils";

//based on tutorial https://www.youtube.com/watch?v=vUe91uOx7R0
const useUploadToStorage = (file, imagesUrl, objectID) => {

    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(0);
    const [url, setUrl] = useState(null);

    //do everytime file changes
    useEffect(() => {
        //references

        const newFileName = createUniqueFileName(file.name);

        const storageRef = ref(storage, newFileName);

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

    const createUniqueFileName = (oldFileName) => {
        const filename = oldFileName;
        var extension = filename.split('.').pop();
        var fileNameWithoutExtension = filename.substring(0, filename.indexOf(extension) - 1);
        var newFileName = fileNameWithoutExtension + uuidv4() + '.' + extension;
        return newFileName;
    }

    function uuidv4() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

    return { progress, url, error }
}

export default useUploadToStorage;