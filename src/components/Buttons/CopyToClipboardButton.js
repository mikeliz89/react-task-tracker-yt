import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Toast, ToastContainer } from 'react-bootstrap';
import { ICONS, TRANSLATION } from '../../utils/Constants';
import Button from '../Buttons/Button';
import { useTranslation } from 'react-i18next';

export default function CopyToClipboardButton({ items, getText, text }) {

  const { t: tCommon, i18n } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showCopiedToast = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    setShowToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowToast(false);
    }, 2200);
  };

  const handleCopy = async () => {
    let textToCopy = '';
    if (typeof getText === 'function') {
      textToCopy = getText(items);
      //console.log('textToCopy', textToCopy);
    } else if (Array.isArray(items)) {
      //console.log('items', items);
      items.forEach(function (arrayItem) {
        textToCopy += arrayItem.title || arrayItem.name || arrayItem.category || JSON.stringify(arrayItem);
        textToCopy += '\n';
      });
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      showCopiedToast();
    } catch (error) {
      console.warn('Copy to clipboard failed', error);
    }
  };

  return (
    <>
      <Button onClick={handleCopy} text={tCommon('buttons.button_copy_to_clipboard')} iconName={ICONS.COPY} />
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 1080 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} autohide delay={2200} bg="success">
          <Toast.Body className="text-white">{tCommon('buttons.copied_to_clipboard')}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}

CopyToClipboardButton.propTypes = {
  items: PropTypes.array,
  getText: PropTypes.func
};
