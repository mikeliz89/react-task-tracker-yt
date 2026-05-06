import React from 'react';
import PropTypes from 'prop-types';
import { ICONS, TRANSLATION } from '../../utils/Constants';
import Button from '../Buttons/Button';
import { useTranslation } from 'react-i18next';

export default function CopyToClipboardButton({ items, getText, text }) {

  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  const handleCopy = () => {
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
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <Button onClick={handleCopy} text={tCommon('buttons.button_copy_to_clipboard')} iconName={ICONS.COPY} />
  );
}

CopyToClipboardButton.propTypes = {
  items: PropTypes.array,
  getText: PropTypes.func
};
