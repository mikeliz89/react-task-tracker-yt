//react
import { useNavigate } from 'react-router-dom';
//buttons
import Button from '../components/Button';

const GoBackButton = () => {

  //navigation
  const navigate = useNavigate();

  return (
    <Button text={''} showIconArrowLeft={true} onClick={() => navigate(-1)} />
  )
}

export default GoBackButton