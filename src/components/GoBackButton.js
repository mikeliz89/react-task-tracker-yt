import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'
import { useTranslation } from 'react-i18next';

const GoBackButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common', { keyPrefix: 'common.buttons' });
  return (
    <Button text={''} showIconArrowLeft={true} onClick={() => navigate(-1)} />
  )
}

export default GoBackButton