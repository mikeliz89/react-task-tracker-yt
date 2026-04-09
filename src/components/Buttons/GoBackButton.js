import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { TRANSLATION, ICONS } from '../../utils/Constants';

import Button from './Button';

export default function GoBackButton() {

  //translation
  const { t: tCommon } = useTranslation(TRANSLATION.COMMON, { keyPrefix: TRANSLATION.COMMON });

  //navigation
  const navigate = useNavigate();

  return (
    <Button iconName={ICONS.ARROW_LEFT}
      onClick={() => {
        navigate(-1)
      }} title={tCommon('buttons.go_back_button_alt')} />
  )
}


