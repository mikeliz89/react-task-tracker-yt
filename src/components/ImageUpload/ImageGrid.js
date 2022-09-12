import useFirestore from '../../hooks/useFirestore';
import styles from './imagegrid.module.css';
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import PageTitle from "../PageTitle";

const ImageGrid = ({ objectID, url, setSelectedImage }) => {

    const { docs } = useFirestore([], url, objectID);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_UPLOAD_IMAGES, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

    return (
        <>
            <PageTitle iconName='images' title={t('images') + (docs.length > 0 ? ' (' + docs.length + ')' : '')} isSubTitle={true} />

            <div className={styles.imgGrid}>
                {docs && docs.map(doc => (
                    <div className={styles.imgWrap} key={doc.id}
                        onClick={() => setSelectedImage(doc.url)}>
                        <img src={doc.url} alt="uploaded pic" />
                    </div>
                ))
                }
                {
                    !docs || docs.length === 0 ? t('no_images') : ''
                }
            </div>
        </>
    )
}

export default ImageGrid;