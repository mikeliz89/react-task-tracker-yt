//proptypes
import PropTypes from 'prop-types';
//react
import { Alert as BootstrapAlert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
//button
import Button from './Button';

function Alert({ message, showMessage, showError, error, onClose, variant }) {

    const { t } = useTranslation('alert', { keyPrefix: 'alert' });

    return (
        <>
            {error && <BootstrapAlert show={showError} variant='danger'>
                {error}
                <div className='d-flex justify-content-end'>
                    <Button
                        type='button'
                        onClick={() => {
                            onClose()
                        }}
                        className='btn btn-success'
                        text={t('button_close')} />
                </div>
            </BootstrapAlert>}
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
                            text={t('button_close')} />
                    </div>
                </BootstrapAlert>
            }
        </>
    )
}

export default Alert

Alert.defaultProps = {
    variant: 'success',
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