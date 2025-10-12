import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { useTranslation } from 'react-i18next';
import { TRANSLATION, DB, ICONS, COLORS, NAVIGATION, VARIANTS } from '../../utils/Constants';

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