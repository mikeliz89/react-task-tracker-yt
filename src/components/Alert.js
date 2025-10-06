import PropTypes from 'prop-types';
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Button from './Buttons/Button';
import * as Constants from '../utils/Constants';

export default function Alert({ message, showMessage, showError, error, onClose, variant }) {

    //translation
    const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, { keyPrefix: Constants.TRANSLATION_COMMON });

    return (
        <>
            {error && <BootstrapAlert show={showError} variant={Constants.VARIANT_DANGER}>
                {error}
                <div className='d-flex justify-content-end'>
                    <Button
                        type='button'
                        onClick={() => {
                            onClose()
                        }}
                        className='btn btn-success'
                        text={tCommon('buttons.button_close')} />
                </div>
            </BootstrapAlert>
            }
            {
                message &&
                <BootstrapAlert show={showMessage} variant={variant}>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <Button
                            type='button'
                            onClick={() => {
                                onClose()
                            }}
                            className='btn btn-success'
                            text={tCommon('buttons.button_close')} />
                    </div>
                </BootstrapAlert>
            }
        </>
    )
}

Alert.defaultProps = {
    variant: Constants.VARIANT_SUCCESS,
    message: '',
    error: '',
    showMessage: false,
    showError: false
}

Alert.propTypes = {
    variant: PropTypes.string,
    message: PropTypes.string,
    error: PropTypes.string,
    showMessage: PropTypes.bool,
    showError: PropTypes.bool,
    onClose: PropTypes.func
}