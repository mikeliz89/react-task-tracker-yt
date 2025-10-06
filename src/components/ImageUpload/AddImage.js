import { useState } from "react"
import UploadForm from "./UploadForm";
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import Button from '../Buttons/Button';

export default function AddImage({ objectID, imagesUrl }) {

    //states
    const [showAddImage, setShowAddImage] = useState(false);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    return (
        <>
            <Button type="button"
                disableStyle={true}
                iconName={Constants.ICON_IMAGES}
                className={showAddImage ? 'btn btn-danger' : 'btn btn-primary'}
                text={
                    showAddImage ? tCommon('buttons.button_close') : t('add_image')
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