import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const GoBackButton = () => {

  //navigation
  const navigate = useNavigate();

  return (
    <Button iconName='arrow-left' onClick={() => navigate(-1)} />
  )
}

export default GoBackButton