import useFirestore from '../../hooks/useFirestore';
import styles from './imagegrid.module.css';
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import { Card } from 'react-bootstrap';
import RightWrapper from '../Site/RightWrapper';
import Button from '../Buttons/Button';
import { useState, useEffect } from 'react';
import ImageGridDeletion from './ImageGridDeletion';

export default function ImageGrid({ objectID, url, setSelectedImage, onCounterChange }) {

    const { docs } = useFirestore([], url, objectID);

    const [deleted, setDeleted] = useState(null);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_UPLOAD_IMAGES, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

    useEffect(() => {
        onCounterChange(docs.length);
    }, [docs]);

    return (
        <>
            {
                docs.length > 0 ? (
                    <div className={styles.imgGrid}>
                        {docs && docs.map(doc => (
                            <Card key={doc.id}>
                                <div className={styles.imgWrap}>
                                    <Card.Img onClick={() => setSelectedImage(doc.url)} src={doc.url} alt="uploaded pic" />
                                </div>
                                <Card.Body>
                                    <RightWrapper>
                                        <Button iconName={Constants.ICON_DELETE}
                                            color={Constants.COLOR_DELETEBUTTON}
                                            text={t('delete')} onClick={() => {
                                                if (window.confirm(t('delete_image_confirm_message'))) { setDeleted(doc.url); }
                                            }} />
                                        {(deleted === doc.url && deleted != null) && <ImageGridDeletion url={url} mainID={objectID}
                                            subID={doc.id} fileName={deleted} />
                                        }
                                    </RightWrapper>
                                </Card.Body>
                            </Card>
                        ))
                        }
                    </div>
                ) : (
                    <div>
                        {t('no_images')}
                    </div>
                )
            }
        </>
    )
}