
import Icon from "../Icon";
import useFirestore from '../../hooks/useFirestore';
import styles from './imagegrid.module.css';
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';

const ImageGrid = ({ objectID, setSelectedImage }) => {

    const { docs } = useFirestore([], objectID);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_UPLOAD_IMAGES, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

    return (
        <>
            <h4>
                <Icon name='images' />
                {t('images')}
            </h4>
            <div className={styles.imgGrid}>
                {docs && docs.map(doc => (
                    <div className={styles.imgWrap} key={doc.id}
                        onClick={() => setSelectedImage(doc.url)}>
                        <img src={doc.url} alt="uploaded pic" />
                    </div>
                ))
                }
            </div>
        </>
    )
}

export default ImageGrid;