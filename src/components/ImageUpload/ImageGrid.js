import useFirestore from '../../hooks/useFirestore';
import styles from './imagegrid.module.css';
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import PageTitle from "../PageTitle";
import { Card } from 'react-bootstrap';
import RightWrapper from '../RightWrapper';
import Button from '../Button';
import { useState } from 'react';
import ImageGridDeletion from './ImageGridDeletion';

const ImageGrid = ({ objectID, url, setSelectedImage }) => {

    const { docs } = useFirestore([], url, objectID);

    const [deleted, setDeleted] = useState(null);

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_UPLOAD_IMAGES, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

    return (
        <>
            <PageTitle iconName='images' title={t('images') + (docs.length > 0 ? ' (' + docs.length + ')' : '')} isSubTitle={true} />

            <div className={styles.imgGrid}>
                {docs && docs.map(doc => (
                    <Card key={doc.id}>
                        <div className={styles.imgWrap}>
                            <Card.Img onClick={() => setSelectedImage(doc.url)} src={doc.url} alt="uploaded pic" />
                        </div>
                        <Card.Body>
                            <RightWrapper>
                                <Button iconName='times' color='red' text='Poista' onClick={() => {
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
                {
                    !docs || docs.length === 0 ? t('no_images') : ''
                }
            </div>
        </>
    )
}

export default ImageGrid;