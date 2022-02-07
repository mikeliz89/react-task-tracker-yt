import {useState, useEffect} from 'react';
import { useParams, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Button from '../Button';

function TaskDetails() {

    const taskUrl = 'http://localhost:5000/tasks'

    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState({})
    const [error, setError] = useState(null)

    const params = useParams();
    const navigate = useNavigate();
    const { pathname } = useLocation()

    //load data
    useEffect(() => {
        const getTask = async () => {

            const taskFromServer = await fetchTaskFromJsonServer()

            setTask(taskFromServer)
            setLoading(false)

            const res = await fetch(`${taskUrl}/${params.id}`)
            const data = await res.json()
        }

        getTask()
    }, [])

    //Fetch Task
    const fetchTaskFromJsonServer = async () => {
        const res = await fetch(`${taskUrl}/${params.id}`)
        const data = await res.json()
        if(res.status === 404) {
            navigate('/')
        }
        return data
    }

  return loading ? (
  <h3>Loading...</h3>
  ) : ( 
  <div>
      <h3>{task.text}</h3>
      <p>{task.day}</p>
      <p>tehtävä valmis: {task.reminder == true ? 'kyllä' : 'ei' }</p>
      <Button text='Go Back' onClick={() => navigate(-1) }/>
  </div> 
  );
};

export default TaskDetails;
