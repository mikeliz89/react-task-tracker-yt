import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GoBackButton from '../GoBackButton';
import Button from '../Button';
import { db } from '../../firebase-config';
import { ref, onValue, update } from "firebase/database";
import AddTask from './AddTask'
import { getCurrentDateAsJson, getJsonAsDateTimeString } from '../../utils/DateTimeUtils'
import { useTranslation } from 'react-i18next';
import i18n from "i18next";
import { ButtonGroup } from 'react-bootstrap'

function TaskDetails() {

  const { t } = useTranslation('tasklist', { keyPrefix: 'tasklist' });

  //const taskUrl = 'http://localhost:5000/tasks'

  const [showEditTask, setShowEditTask] = useState(false)
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState({})

  const params = useParams();
  const navigate = useNavigate();

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
          navigate(-1)
      }
      return data
  }
  */

  /** Fetch Task From Firebase */
  const fetchTaskFromFirebase = async () => {
    const dbref = ref(db, '/tasks/' + params.tasklistid + '/' + params.id);
    onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      if (data === null) {
        navigate(-1)
      }
      setTask(data)
      setLoading(false);
    })
  }

  /** Add Task To Firebase */
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
      <ButtonGroup aria-label="Button group">
        <GoBackButton />
        <Button
          text={showEditTask ? t('button_close') : t('button_edit')}
          color={showEditTask ? 'red' : 'orange'}
          onClick={() => setShowEditTask(!showEditTask)} />
      </ButtonGroup>
      <div className={task.reminder === true ? 'task reminder' : ''}>
        <h4 className="page-title">{task.text}</h4>
        <p>{t('day_and_time')}: {task.day}</p>
        {showEditTask && <AddTask onAddTask={addTask} taskID={params.id} taskListID={params.tasklistid} />}
        <p>{t('created')}: {getJsonAsDateTimeString(task.created, i18n.language)}<br />
          {t('created_by')}: {task.createdBy}<br />
          {t('modified')}: {getJsonAsDateTimeString(task.modified, i18n.language)}</p>
        <p>{t('set_reminder')}: {task.reminder === true ? t('yes') : t('no')}</p>
      </div>
    </div>
  );
};

export default TaskDetails;
