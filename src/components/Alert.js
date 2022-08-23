//react
import { Alert as bootstrapAlert } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
//button
import Button from './Button';

function Alert({ innerRef }) {

    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);

    const { t } = useTranslation('alert', { keyPrefix: 'alert' });

    return (
        <>
            {
                message &&
                <Alert ref={innerRef} show={showMessage} variant='success'>
                    {message}
                    <div className='d-flex justify-content-end'>
                        <Button
                            type='button'
                            onClick={() => setShowMessage(false)} className='btn btn-success'
                            title={t('button_close')} />
                    </div>
                </Alert>
            }
        </>
    )
}

export default Alert