import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Alert from '../Alert';
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';
import ProgressBar from './ProgressBar';
import CenterWrapper from '../Site/CenterWrapper';

export default function UploadForm({ objectID, imagesUrl }) {

    //translation
    const { t } = useTranslation(Constants.TRANSLATION_UPLOAD_IMAGES, { keyPrefix: Constants.TRANSLATION_UPLOAD_IMAGES });

    //states
    const [file, setFile] = useState(null);
    //alert
    const [showMessage, setShowMessage] = useState(false);
    const [message] = useState('');
    const [showError, setShowError] = useState(false);
    const [error, setError] = useState('');

    const types = ['image/png', 'image/jpeg'];

    const changeHandler = (e) => {
        let selected = e.target.files[0];
        if (selected && types.includes(selected.type)) {
            setFile(selected);
            setShowError(false);
            setError('');
        } else {
            setFile(null);
            setShowError(true);
            setError(t('please_use_correct_format'));
        }
    }
    return (
        <>
            <Alert message={message} showMessage={showMessage}
                error={error} showError={showError}
                variant={Constants.VARIANT_INFO}
                onClose={() => { setShowMessage(false); setShowError(false); }}
            />

            <Form>
                <Form.Group className="mb-3" controlId="addGearForm-Name">
                    <Form.Label>{t('load_image')}</Form.Label>
                    <Form.Control type='file'
                        autoComplete="off"
                        onChange={changeHandler} />
                </Form.Group>
            </Form>

            <CenterWrapper>
                {
                    file && <div> {file.name}</div>
                }
                {
                    file && <ProgressBar file={file} setFile={setFile} objectID={objectID} imagesUrl={imagesUrl} />
                }
            </CenterWrapper>
        </>
    )
}