import {useState, useEffect} from 'react';
import { useParams, /*Navigate,*/ useNavigate/*, useLocation */} from 'react-router-dom';
import GoBackButton from '../GoBackButton';

import { db } from '../../firebase-config';
import { ref, onValue } from "firebase/database";

function TaskDetails() {

    //const taskUrl = 'http://localhost:5000/tasks'

    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState({})
    //const [error, setError] = useState(null)

    const params = useParams();
    const navigate = useNavigate();
    //const { pathname } = useLocation()

    //load data
    useEffect(() => {
        const getTask = async () => {

            await fetchTaskFromFirebase();

            /*
            const taskFromServer = await fetchTaskFromJsonServer()
            setTask(taskFromServer)
            setLoading(false)
            */
        }

        getTask()
    }, [])

    /*
    const fetchTaskFromJsonServer = async () => {
        const res = await fetch(`${taskUrl}/${params.id}`)
        const data = await res.json()
        if(res.status === 404) {
            navigate('/')
        }
        return data
    }
    */

    const fetchTaskFromFirebase = async () => {
        const dbref = await ref(db, '/tasks/' + params.tasklistid + '/' + params.id);
        onValue(dbref, (snapshot) => {
          const data = snapshot.val();
          if(data === null) {
            navigate(-1)
          }
          setTask(data)
          setLoading(false);
        })
      }

  return loading ? (
  <h3>Loading...</h3>
  ) : ( 
  <div>
      <h3>{task.text}</h3>
      <p>Created: {task.created}</p>
      <p>Created by: {task.createdBy}</p>
      <p>Day & Time: {task.day}</p>
      <p>Task ready: {task.reminder === true ? 'yes' : 'no' }</p>
      <GoBackButton  />
  </div> 
  );
};

export default TaskDetails;
