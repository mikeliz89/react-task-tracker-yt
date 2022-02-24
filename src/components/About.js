import { useNavigate } from 'react-router-dom';
import Button from '../components/Button'

const About = () => {
    const navigate = useNavigate();
    return (
        <div>
            <Button text='Go Back' onClick={() => navigate(-1) }/> 
            <h4>Version 1.0.0</h4>
            <h4>Author: Miika Kontio</h4>
        </div>
    )
}

export default About
