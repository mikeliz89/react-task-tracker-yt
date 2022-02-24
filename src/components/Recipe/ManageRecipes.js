import Button from '../Button';
import { useNavigate } from 'react-router-dom';

const ManageRecipes = () => {

  const navigate = useNavigate();
  return (
    <div>
      <h3 className="page-title">Manage Recipes</h3>
       <Button text='Go Back' onClick={() => navigate(-1) }/> 
       <p>Coming soon..</p>
    </div>
  )
}

export default ManageRecipes