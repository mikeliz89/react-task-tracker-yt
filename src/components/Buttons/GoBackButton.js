import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import * as Constants from '../../utils/Constants';

export default function GoBackButton() {

  //translation
  const { t } = useTranslation(Constants.TRANSLATION, { keyPrefix: Constants.TRANSLATION_COMMON_BUTTONS });
  const { t: tCommon } = useTranslation(Constants.TRANSLATION_COMMON, {keyPrefix: Constants.TRANSLATION_COMMON});

  //navigation
  const navigate = useNavigate();

  return (
    <Button iconName={Constants.ICON_ARROW_LEFT} onClick={() => navigate(-1)} title={t('go_back_button_alt')} />
  )
}