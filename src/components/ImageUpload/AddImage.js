import { useState } from "react"
import UploadForm from "./UploadForm";
import { useTranslation } from "react-i18next";
import { TRANSLATION, ICONS } from '../../utils/Constants';
import Button from '../Buttons/Button';

export default function AddImage({ objectID, imagesUrl }) {

    //states
    const [showAddImage, setShowAddImage] = useState(false);

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.UPLOAD_IMAGES });
    const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

    return (
        <>
            <Button type="button"
                disableStyle={true}
                iconName={ICONS.IMAGES}
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