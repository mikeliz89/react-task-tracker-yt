//react
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
//buttons
import Button from '../components/Button';

const GoBackButton = () => {

  //navigation
  const navigate = useNavigate();

  //translation
  const { t } = useTranslation('common', { keyPrefix: 'common.buttons' });

  return (
    <Button text={''} showIconArrowLeft={true} onClick={() => navigate(-1)} />
  )
}

export default GoBackButton