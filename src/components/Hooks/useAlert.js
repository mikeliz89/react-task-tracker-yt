// useAlert.js
import { useState } from 'react';

export function useAlert() {
    const [message, setMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const clearMessages = () => {
        setMessage('');
        setShowMessage(false);
        setError('');
        setShowError(false);
    };

    const showSuccess = (msg) => {
        setMessage(msg);
        setShowMessage(true);
    };

    const showFailure = (msg) => {
        setError(msg);
        setShowError(true);
    };

    return {
        message, setMessage,
        showMessage, setShowMessage,
        error, setError,
        showError, setShowError,
        clearMessages,
        showSuccess,
        showFailure
    };
}