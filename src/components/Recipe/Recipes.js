import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const Recipes = () => {

  const navigate = useNavigate();
  return (
    <div>
        <h3>Recipes</h3>
        <p>Coming soon..</p>
        <Button text='Go Back' onClick={() => navigate(-1) }/>
    </div>
  )
}

export default Recipes