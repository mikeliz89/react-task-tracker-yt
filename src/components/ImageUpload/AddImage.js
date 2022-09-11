import { useState } from "react"
import UploadForm from "./UploadForm";
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import Button from "../Button";

function AddImage({ objectID, imagesUrl }) {

    //states
    const [showAddImage, setShowAddImage] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_UPLOAD_IMAGES, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

    return (
        <>
            <Button type="button"
                disableStyle={true}
                className={showAddImage ? 'btn btn-danger' : 'btn btn-primary'}
                text={
                    showAddImage ? t('button_close') : t('add_image')
                }
                onClick={() => setShowAddImage(!showAddImage)} />
            {showAddImage &&
                <>
                    <UploadForm objectID={objectID} imagesUrl={imagesUrl} />
                </>
            }
        </>
    )
}

export default AddImage