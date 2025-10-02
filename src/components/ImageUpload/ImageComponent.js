import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as Constants from '../../utils/Constants';
import AddImage from './AddImage';
import ImageGrid from './ImageGrid';
import Modal from './Modal';
import PageTitle from '../Site/PageTitle';

export default function ImageComponent({ objID, url }) {

  const [selectedImage, setSelectedImage] = useState(null);
  const [counter, setCounter] = useState(0);

  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

  const getCounter = () => {
    return t('images') + (counter > 0 ? ' (' + counter + ')' : '');
  }

  return (
    <>
      <PageTitle iconName={Constants.ICON_IMAGES} title={getCounter()} isSubTitle={true} />
      <AddImage objectID={objID} imagesUrl={url} />
      <ImageGrid url={url} objectID={objID} setSelectedImage={setSelectedImage} onCounterChange={setCounter} />
      {selectedImage && <Modal selectedImage={selectedImage} setSelectedImage={setSelectedImage} />}
    </>
  )
}
