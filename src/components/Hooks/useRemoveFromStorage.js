import { useState, useEffect } from "react";
import { storage } from "../../firebase-config";
import { ref, deleteObject } from 'firebase/storage';
import { removeFromFirebaseByIdAndSubId } from "../../datatier/datatier";

const useRemoveFromStorage = (imagesUrl, mainID, subID, fileName) => {

    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(0);

    //do everytime file changes
    useEffect(() => {

        //console.log(imagesUrl, mainID, subID, fileName);

        // Create a reference to the file to delete
        const fileRef = ref(storage, fileName);

        // Delete the file
        deleteObject(fileRef).then(() => {
            // File deleted successfully
            removeFromFirebaseByIdAndSubId(imagesUrl, mainID, subID);
            setSuccess(true);
        }).catch((err) => {
            // Uh-oh, an error occurred!
            setError(err);
        });

    }, [imagesUrl, mainID, subID, fileName]);

    return { error, success }
}

export default useRemoveFromStorage;