import { useState, useEffect } from 'react';
import { useParams, /*Navigate,*/ useNavigate/*, useLocation */} from 'react-router-dom';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { db } from '../../firebase-config';
import { ref, onValue, update } from "firebase/database";
import AddTask from './AddTask'
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils'
import { useTranslation } from 'react-i18next';
import i18n from "i18next";

function TaskDetails() {

    const { t } = useTranslation();

    //const taskUrl = 'http://localhost:5000/tasks'

    const [showEditTask, setShowEditTask] = useState(false)
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
        const dbref = ref(db, '/tasks/' + params.tasklistid + '/' + params.id);
        onValue(dbref, (snapshot) => {
          const data = snapshot.val();
          if(data === null) {
            navigate(-1)
          }
          setTask(data)
          setLoading(false);
        })
      }

      const addTask = async (taskListID, task) => {
        var taskID = params.id;
        //save edited task to firebase
        const updates = {};
        task["modified"] = getCurrentDateAsJson()
        updates[`/tasks/${taskListID}/${taskID}`] = task;
        update(ref(db), updates);
      }

  return loading ? (
  <h3>{t('loading')}</h3>
  ) : ( 
  <div>
      <h3>{task.text}</h3>
      <GoBackButton  />
      <Button text={showEditTask ? t('button_close') : t('button_edit')} 
                color={showEditTask ? 'red' : 'orange'} 
                onClick={() => setShowEditTask(!showEditTask) }/>
      {showEditTask && <AddTask onAddTask={addTask} taskID={params.id} taskListID={params.tasklistid}  /> }
      <p>{t('created')}: {getJsonAsDateTimeString(task.created, i18n.language)}</p>
      <p>{t('created_by')}: {task.createdBy}</p>
      <p>{t('modified')}: {getJsonAsDateTimeString(task.modified, i18n.language)}</p>
      <p>{t('day_and_time')}: {task.day}</p>
      <p>{t('set_reminder')}: {task.reminder === true ? t('yes') : t('no') }</p>
  </div> 
  );
};

export default TaskDetails;
