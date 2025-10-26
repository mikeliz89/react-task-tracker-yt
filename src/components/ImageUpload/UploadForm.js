import { useState } from 'react';
import { Form } from 'react-bootstrap';
import Alert from '../Alert';
import { useTranslation } from 'react-i18next';
import { TRANSLATION } from '../../utils/Constants';
import ProgressBar from './ProgressBar';
import CenterWrapper from '../Site/CenterWrapper';
import { useAlert } from '../Hooks/useAlert';

export default function UploadForm({ objectID, imagesUrl }) {

    //translation
    const { t } = useTranslation(TRANSLATION.TRANSLATION, { keyPrefix: TRANSLATION.UPLOAD_IMAGES });

    //states
    const [file, setFile] = useState(null);

    //alert
    const {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages
    } = useAlert();

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
            <Alert
                message={message}
                showMessage={showMessage}
                error={error}
                showError={showError}
                onClose={clearMessages}
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